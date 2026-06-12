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

export const useArticles = ({ category, page = 0, limit = 12, search = "" } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  return useQuery({
    queryKey: ["articles", "public", { category, page, limit, search }],
    queryFn: () => fetcher(`/articles?${params}`),
    staleTime: 1000 * 60 * 5,
  });
};

export const useFeaturedArticles = () =>
  useQuery({
    queryKey: ["articles", "featured"],
    queryFn: () => fetcher("/articles/featured"),
    staleTime: 1000 * 60 * 5,
  });

export const useArticleCategories = () =>
  useQuery({
    queryKey: ["articles", "categories"],
    queryFn: () => fetcher("/articles/categories"),
    staleTime: 1000 * 60 * 10,
  });

export const useArticleBySlug = (slug) =>
  useQuery({
    queryKey: ["articles", "public", slug],
    queryFn: () => fetcher(`/articles/${slug}`),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });

// ============================================
// ADMIN
// ============================================

export const useAdminArticles = ({ page = 0, limit = 20, search = "", status = "" } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  return useQuery({
    queryKey: ["articles", "admin", "list", { page, limit, search, status }],
    queryFn: () => fetcher(`/admin/articles/admin/list?${params}`),
    staleTime: 1000 * 30,
  });
};

export const useAdminArticle = (id) =>
  useQuery({
    queryKey: ["articles", "admin", id],
    queryFn: () => fetcher(`/admin/articles/admin/${id}`),
    enabled: Boolean(id),
    staleTime: 1000 * 30,
  });

export const useSaveArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      id
        ? fetcher(`/admin/articles/admin/${id}`, { method: "PUT", body: JSON.stringify(data) })
        : fetcher("/admin/articles/admin", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};

export const useDeleteArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => fetcher(`/admin/articles/admin/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};

export const useSeedCategories = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => fetcher("/admin/articles/admin/seed-categories", { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["articles", "categories"] }),
  });
};
