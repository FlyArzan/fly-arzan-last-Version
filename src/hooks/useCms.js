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
    },
  });
};
