import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// ============================================
// PUBLIC CMS HOOKS (for frontend pages)
// ============================================

/**
 * Fetch published CMS page content (public, no auth required)
 * @param {string} slug - Page slug (e.g., "about_us", "faq", "contact")
 */
export const usePublicCmsPage = (slug) => {
  return useQuery({
    queryKey: ["cms", "public", slug],
    queryFn: async () => {
      const url = `${API_BASE_URL}/api/cms/public/${slug}`;
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Failed to fetch CMS page: ${res.status}`);
      return res.json();
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 1,
  });
};

// ============================================
// ADMIN CMS HOOKS (for dashboard)
// ============================================

const fetcher = async (path, options = {}) => {
  const url = `${API_BASE_URL}/api${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

// Fetcher that returns null for 404 instead of throwing
const fetcherWithNotFound = async (path) => {
  const url = `${API_BASE_URL}/api${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (res.status === 404) {
    return null; // Page doesn't exist yet, return null instead of error
  }
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

export const useCmsPage = (slug) => {
  return useQuery({
    queryKey: ["cms", slug],
    queryFn: () => fetcherWithNotFound(`/admin/cms/${slug}`),
    enabled: Boolean(slug),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
};

export const useCmsList = () => {
  return useQuery({
    queryKey: ["cms", "list"],
    queryFn: () => fetcher(`/admin/cms/pages`),
  });
};

export const useSaveCmsPage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, payload }) => {
      return fetcher(`/admin/cms/${slug}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["cms", data.slug] });
      qc.invalidateQueries({ queryKey: ["cms", "list"] });
      qc.invalidateQueries({ queryKey: ["airports", "public"] });
      qc.invalidateQueries({ queryKey: ["airlines", "public"] });
    },
  });
};

export const usePaginatedAirports = (page = 0, limit = 10, search = "", letter = "") => {
  return useQuery({
    queryKey: ["cms", "airports", page, limit, search, letter],
    queryFn: () =>
      fetcher(
        `/admin/cms/airport_info/airports/paginated?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&letter=${encodeURIComponent(letter)}`,
      ),
    staleTime: 1000 * 30,
    placeholderData: (previousData) => previousData,
  });
};

// ============================================
// PUBLIC AIRPORT DIRECTORY HOOKS
// Back /Airport (hub) and /Airport/:iata (detail). These deliberately do NOT
// go through `fetcher` — it sends `credentials: "include"`, and these endpoints
// are public. The hub must not use `usePublicCmsPage("airport_info")` either:
// that returns the entire blob, every airport with all its detail.
// ============================================

const publicFetcher = async (path) => {
  const res = await fetch(`${API_BASE_URL}/api${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

const publicFetcherWithNotFound = async (path) => {
  const res = await fetch(`${API_BASE_URL}/api${path}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

/**
 * Server-paginated, A-Z sorted airport list for the directory hub.
 * @returns {{ airports: [], total: number, page: number, limit: number }}
 */
export const usePublicAirports = ({
  search = "",
  letter = "",
  page = 0,
  limit = 12,
} = {}) => {
  return useQuery({
    queryKey: ["airports", "public", "list", { search, letter, page, limit }],
    queryFn: () =>
      publicFetcher(
        `/cms/public/airport_info/airports?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&letter=${encodeURIComponent(letter)}`,
      ),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });
};

/**
 * Hub page chrome: the CMS-editable title/hero plus which A-Z initials have
 * airports. Deliberately NOT usePublicCmsPage("airport_info") — that returns
 * every airport with all of its detail just to read two strings.
 * @returns {{ title, hero, letters: string[], counts: object, total: number }}
 */
export const useAirportDirectoryMeta = () => {
  return useQuery({
    queryKey: ["airports", "public", "meta"],
    queryFn: () => publicFetcher(`/cms/public/airport_info/meta`),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};

/** One airport by IATA code. Resolves to null (not an error) when unknown. */
export const usePublicAirport = (iata) => {
  return useQuery({
    queryKey: ["airports", "public", "detail", iata],
    queryFn: () =>
      publicFetcherWithNotFound(
        `/cms/public/airport_info/airports/${encodeURIComponent(String(iata).toUpperCase())}`,
      ),
    enabled: Boolean(iata),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

// ============================================
// PUBLIC AIRLINE DIRECTORY HOOKS
// Mirrors the airport hooks above exactly; backed by the published CMS page
// with slug "airlines".
// ============================================

/**
 * Server-paginated, A-Z sorted airline list for the directory hub.
 * @returns {{ airlines: [], total: number, page: number, limit: number }}
 */
export const usePublicAirlines = ({
  search = "",
  letter = "",
  page = 0,
  limit = 12,
} = {}) => {
  return useQuery({
    queryKey: ["airlines", "public", "list", { search, letter, page, limit }],
    queryFn: () =>
      publicFetcher(
        `/cms/public/airlines?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&letter=${encodeURIComponent(letter)}`,
      ),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });
};

/**
 * Hub page chrome: the CMS-editable title/hero plus which A-Z initials have
 * airlines (so the rail can disable empty letters).
 * @returns {{ title, hero, letters: string[], counts: object, total: number }}
 */
export const useAirlineDirectoryMeta = () => {
  return useQuery({
    queryKey: ["airlines", "public", "meta"],
    queryFn: () => publicFetcher(`/cms/public/airlines/meta`),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};

/** One airline by IATA code. Resolves to null (not an error) when unknown. */
export const usePublicAirline = (iata) => {
  return useQuery({
    queryKey: ["airlines", "public", "detail", iata],
    queryFn: () =>
      publicFetcherWithNotFound(
        `/cms/public/airlines/${encodeURIComponent(String(iata).toUpperCase())}`,
      ),
    enabled: Boolean(iata),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
