import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const fetcher = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

// ============================================
// PUBLIC
// ============================================

export const useVisaCountries = ({ search = "", page = 0, limit = 50 } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.set("search", search);
  return useQuery({
    queryKey: ["visa", "public", "list", { search, page, limit }],
    queryFn: () => fetcher(`/visa-info?${params}`),
    staleTime: 1000 * 60 * 5,
  });
};

export const useVisaCountry = (slug) =>
  useQuery({
    queryKey: ["visa", "public", slug],
    queryFn: () => fetcher(`/visa-info/${slug}`),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });

// ============================================
// ADMIN
// ============================================

export const useAdminVisaList = ({ page = 0, limit = 20, search = "", status = "" } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  return useQuery({
    queryKey: ["visa", "admin", "list", { page, limit, search, status }],
    queryFn: () => fetcher(`/admin/visa/admin/list?${params}`),
    staleTime: 1000 * 30,
  });
};

export const useAdminVisaCountry = (id) =>
  useQuery({
    queryKey: ["visa", "admin", id],
    queryFn: () => fetcher(`/admin/visa/admin/${id}`),
    enabled: Boolean(id),
    staleTime: 1000 * 30,
  });

export const useSaveVisaCountry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      id
        ? fetcher(`/admin/visa/admin/${id}`, { method: "PUT", body: JSON.stringify(data) })
        : fetcher("/admin/visa/admin", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visa"] });
    },
  });
};

export const useDeleteVisaCountry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => fetcher(`/admin/visa/admin/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visa"] });
    },
  });
};
