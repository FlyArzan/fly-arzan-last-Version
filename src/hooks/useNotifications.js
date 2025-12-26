import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Helper to make API calls
 */
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}/api${endpoint}`;

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

// ============================================
// USER NOTIFICATION HOOKS
// ============================================

/**
 * Hook to get current user's notifications
 */
export const useNotifications = ({
  page = 1,
  limit = 20,
  unreadOnly = false,
} = {}) => {
  return useQuery({
    queryKey: ["notifications", { page, limit, unreadOnly }],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...(unreadOnly && { unreadOnly: "true" }),
      });

      const data = await apiFetch(`/notifications?${params.toString()}`);

      return {
        notifications: data?.notifications ?? [],
        total: data?.total ?? 0,
        unreadCount: data?.unreadCount ?? 0,
        page,
        totalPages: Math.ceil((data?.total ?? 0) / limit),
      };
    },
  });
};

/**
 * Hook to get unread notification count
 */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const data = await apiFetch("/notifications/unread-count");
      return data?.count ?? 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

/**
 * Hook to mark a notification as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId) => {
      return apiFetch(`/notifications/${notificationId}/read`, {
        method: "PUT",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiFetch("/notifications/mark-all-read", {
        method: "PUT",
      });
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark notifications as read");
    },
  });
};

/**
 * Hook to delete a notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId) => {
      return apiFetch(`/notifications/${notificationId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// ============================================
// ADMIN NOTIFICATION HOOKS
// ============================================

/**
 * Hook to send notification to a single user (admin)
 */
export const useSendNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, title, message, type = "info" }) => {
      return apiFetch("/notifications/admin/send", {
        method: "POST",
        body: JSON.stringify({ userId, title, message, type }),
      });
    },
    onSuccess: () => {
      toast.success("Notification sent successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
    onError: (error) => {
      if (error.message?.includes("disabled notifications")) {
        toast.error("User has disabled notifications");
      } else {
        toast.error(error.message || "Failed to send notification");
      }
    },
  });
};

/**
 * Hook to send notification to multiple users (admin)
 */
export const useSendBulkNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userIds, title, message, type = "info" }) => {
      return apiFetch("/notifications/admin/send-bulk", {
        method: "POST",
        body: JSON.stringify({ userIds, title, message, type }),
      });
    },
    onSuccess: (data) => {
      if (data.sent > 0) {
        toast.success(`Notification sent to ${data.sent} users`);
        if (data.blocked > 0) {
          toast.info(`${data.blocked} users have notifications disabled`);
        }
      } else {
        toast.warning(
          "No users received the notification (all have notifications disabled)"
        );
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send notifications");
    },
  });
};

/**
 * Hook to get all notifications (admin view)
 */
export const useAdminNotifications = ({ page = 1, limit = 50 } = {}) => {
  return useQuery({
    queryKey: ["admin", "notifications", { page, limit }],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const data = await apiFetch(
        `/notifications/admin/all?${params.toString()}`
      );

      return {
        notifications: data?.notifications ?? [],
        total: data?.total ?? 0,
        page,
        totalPages: Math.ceil((data?.total ?? 0) / limit),
      };
    },
  });
};

// ============================================
// ADMIN EMAIL HOOKS
// ============================================

/**
 * Hook to send email to a single user (admin)
 */
export const useSendEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, subject, content }) => {
      return apiFetch("/admin/email/send", {
        method: "POST",
        body: JSON.stringify({ userId, subject, content }),
      });
    },
    onSuccess: () => {
      toast.success("Email sent successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "email"] });
    },
    onError: (error) => {
      if (error.message?.includes("disabled newsletter")) {
        toast.error("User has disabled newsletter/emails");
      } else {
        toast.error(error.message || "Failed to send email");
      }
    },
  });
};

/**
 * Hook to send email to multiple users (admin)
 */
export const useSendBulkEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userIds, subject, content }) => {
      return apiFetch("/admin/email/send-bulk", {
        method: "POST",
        body: JSON.stringify({ userIds, subject, content }),
      });
    },
    onSuccess: (data) => {
      if (data.sent > 0) {
        toast.success(`Email sent to ${data.sent} users`);
        if (data.blocked > 0) {
          toast.info(`${data.blocked} users have newsletter disabled`);
        }
      } else {
        toast.warning(
          "No users received the email (all have newsletter disabled)"
        );
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "email"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send emails");
    },
  });
};

/**
 * Hook to send email to all newsletter subscribers (admin)
 */
export const useSendToAllSubscribers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subject, content }) => {
      return apiFetch("/admin/email/send-to-all-subscribers", {
        method: "POST",
        body: JSON.stringify({ subject, content }),
      });
    },
    onSuccess: (data) => {
      // Check if the operation was successful (campaign was created)
      if (data.success === false) {
        // No subscribers found - backend returned success: false
        toast.warning(data.message || "No newsletter subscribers found");
      } else if (data.sent > 0 && data.failed === 0) {
        // All emails sent successfully
        toast.success(`Email sent to ${data.sent} subscriber${data.sent > 1 ? 's' : ''}`);
      } else if (data.sent > 0 && data.failed > 0) {
        // Some emails sent, some failed
        toast.warning(`Email sent to ${data.sent} subscriber${data.sent > 1 ? 's' : ''}, ${data.failed} failed`);
      } else if (data.failed > 0) {
        // All emails failed
        toast.error(`Failed to send emails to ${data.failed} subscriber${data.failed > 1 ? 's' : ''}`);
      } else {
        // Campaign created but no emails to send (edge case)
        toast.info("Campaign created");
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "email"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send emails");
    },
  });
};

/**
 * Hook to get email campaigns (admin)
 */
export const useEmailCampaigns = ({ page = 1, limit = 20 } = {}) => {
  return useQuery({
    queryKey: ["admin", "email", "campaigns", { page, limit }],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const data = await apiFetch(
        `/admin/email/campaigns?${params.toString()}`
      );

      return {
        campaigns: data?.campaigns ?? [],
        total: data?.total ?? 0,
        page,
        totalPages: Math.ceil((data?.total ?? 0) / limit),
      };
    },
  });
};

/**
 * Hook to get a single email campaign (admin)
 */
export const useEmailCampaign = (campaignId) => {
  return useQuery({
    queryKey: ["admin", "email", "campaign", campaignId],
    queryFn: async () => {
      const data = await apiFetch(`/admin/email/campaigns/${campaignId}`);
      return data;
    },
    enabled: !!campaignId,
  });
};

/**
 * Hook to get email stats (admin)
 */
export const useEmailStats = () => {
  return useQuery({
    queryKey: ["admin", "email", "stats"],
    queryFn: async () => {
      const data = await apiFetch("/admin/email/stats");
      return data;
    },
  });
};

/**
 * Hook to check if user can receive emails
 */
export const useCheckEmailEligibility = (userId) => {
  return useQuery({
    queryKey: ["admin", "email", "eligibility", userId],
    queryFn: async () => {
      const data = await apiFetch(`/admin/email/check-eligibility/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};
