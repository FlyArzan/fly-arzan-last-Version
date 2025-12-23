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

  const text = await response.text();

  if (!text || text.trim() === "") {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return { success: true };
  }

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
 * Hook to list all customers with pagination
 * Uses custom /api/admin/customers endpoint
 */
export const useCustomers = ({ page = 1, limit = 20, search = "" } = {}) => {
  return useQuery({
    queryKey: ["admin", "customers", { page, limit, search }],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (search) {
        params.append("searchValue", search);
      }

      const data = await adminFetch(`/customers?${params.toString()}`, {
        method: "GET",
      });

      return {
        customers: data?.customers ?? [],
        total: data?.total ?? 0,
        page,
        totalPages: Math.ceil((data?.total ?? 0) / limit),
      };
    },
  });
};

/**
 * Hook to get customer statistics overview
 */
export const useCustomerStats = () => {
  return useQuery({
    queryKey: ["admin", "customers", "stats"],
    queryFn: async () => {
      const data = await adminFetch("/customers/stats/overview", {
        method: "GET",
      });
      return data;
    },
  });
};

/**
 * Hook to get a single customer by ID
 */
export const useCustomer = (customerId) => {
  return useQuery({
    queryKey: ["admin", "customer", customerId],
    queryFn: async () => {
      const data = await adminFetch(`/customers/${customerId}`, {
        method: "GET",
      });
      return data;
    },
    enabled: !!customerId,
  });
};

/**
 * Hook to update customer communication preferences
 */
export const useUpdateCustomerPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId, wantsNotifications, wantsNewsletter }) => {
      return adminFetch(`/customers/${customerId}/preferences`, {
        method: "PUT",
        body: JSON.stringify({ wantsNotifications, wantsNewsletter }),
      });
    },
    onSuccess: () => {
      toast.success("Customer preferences updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "customer"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update preferences");
    },
  });
};

/**
 * Hook to ban a customer
 */
export const useBanCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId, banReason, banExpiresIn }) => {
      return adminFetch(`/customers/${customerId}/ban`, {
        method: "POST",
        body: JSON.stringify({ banReason, banExpiresIn }),
      });
    },
    onSuccess: () => {
      toast.success("Customer banned successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "customer"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to ban customer");
    },
  });
};

/**
 * Hook to unban a customer
 */
export const useUnbanCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId }) => {
      return adminFetch(`/customers/${customerId}/unban`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast.success("Customer unbanned successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "customer"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unban customer");
    },
  });
};

/**
 * Hook to delete a customer
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId }) => {
      return adminFetch(`/customers/${customerId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Customer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete customer");
    },
  });
};
