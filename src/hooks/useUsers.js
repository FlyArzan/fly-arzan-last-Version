import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Helper to make API calls to custom admin endpoints
 */
const adminFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}/api/admin${endpoint}`;

  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  // Get response text first
  const text = await response.text();

  // Handle empty responses
  if (!text || text.trim() === "") {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return { success: true };
  }

  // Try to parse as JSON
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}: ${text}`);
    }
    return { success: true, message: text };
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
};

/**
 * Hook to list all users with pagination
 * Uses custom /api/admin/users endpoint
 */
export const useUsers = ({ page = 1, limit = 20, search = "" } = {}) => {
  return useQuery({
    queryKey: ["admin", "users", { page, limit, search }],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (search) {
        params.append("searchValue", search);
      }

      const data = await adminFetch(`/users?${params.toString()}`, {
        method: "GET",
      });

      return {
        users: data?.users ?? [],
        total: data?.total ?? 0,
        page,
        totalPages: Math.ceil((data?.total ?? 0) / limit),
      };
    },
  });
};

/**
 * Hook to get a single user by ID
 */
export const useUser = (userId) => {
  return useQuery({
    queryKey: ["admin", "user", userId],
    queryFn: async () => {
      const data = await adminFetch(`/users/${userId}`, {
        method: "GET",
      });
      return data;
    },
    enabled: !!userId,
  });
};

/**
 * Hook to get user sessions
 */
export const useUserSessions = (userId) => {
  return useQuery({
    queryKey: ["admin", "user-sessions", userId],
    queryFn: async () => {
      const data = await adminFetch(`/users/${userId}/sessions`, {
        method: "GET",
      });
      return data?.sessions ?? [];
    },
    enabled: !!userId,
  });
};

/**
 * Hook to set user role
 */
export const useSetUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }) => {
      return adminFetch(`/users/${userId}/set-role`, {
        method: "POST",
        body: JSON.stringify({ role }),
      });
    },
    onSuccess: (_, { role }) => {
      toast.success(`Role changed to ${role} successfully`);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to change role");
    },
  });
};

/**
 * Hook to ban a user
 */
export const useBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, banReason, banExpiresIn }) => {
      return adminFetch(`/users/${userId}/ban`, {
        method: "POST",
        body: JSON.stringify({ banReason, banExpiresIn }),
      });
    },
    onSuccess: () => {
      toast.success("User banned successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to ban user");
    },
  });
};

/**
 * Hook to unban a user
 */
export const useUnbanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }) => {
      return adminFetch(`/users/${userId}/unban`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast.success("User unbanned successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unban user");
    },
  });
};

/**
 * Hook to revoke a user session
 */
export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, sessionId }) => {
      return adminFetch(`/users/${userId}/sessions/${sessionId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user-sessions"] });
    },
  });
};

/**
 * Hook to revoke all sessions for a user
 */
export const useRevokeAllSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }) => {
      return adminFetch(`/users/${userId}/sessions`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user-sessions"] });
    },
  });
};

/**
 * Hook to remove a user
 */
export const useRemoveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }) => {
      return adminFetch(`/users/${userId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

/**
 * Hook to impersonate a user (placeholder - not implemented in backend)
 */
export const useImpersonateUser = () => {
  return useMutation({
    mutationFn: async ({ userId }) => {
      // This would need backend implementation
      console.log("Impersonate user:", userId);
      return { success: true };
    },
  });
};
