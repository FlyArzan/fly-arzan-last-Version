import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

/**
 * Helper to make API calls to admin monitoring endpoints
 */
const adminFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}/api/admin${endpoint}`;

  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
    body: options.body,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
};

export const useSystemLogs = ({ limit = 50, offset = 0, level = "all", service = "all", search = "" }) => {
  return useQuery({
    queryKey: ["admin", "system-logs", { limit, offset, level, service, search }],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        level,
        service,
        search,
      });
      return adminFetch(`/monitoring/system-logs?${params}`);
    },
  });
};

export const useSystemLogStats = () => {
  return useQuery({
    queryKey: ["admin", "system-logs", "stats"],
    queryFn: async () => {
      return adminFetch("/monitoring/system-logs/stats");
    },
  });
};
