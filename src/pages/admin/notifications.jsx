import { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Pagination,
  IconButton,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  LocalOffer as PromoIcon,
  Settings as SystemIcon,
  DoneAll as DoneAllIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from "@/hooks/useNotifications";

const AdminNotificationsPage = () => {
  const [page, setPage] = useState(1);

  // Fetch notifications
  const { data, isLoading, error, refetch } = useNotifications({
    page,
    limit: 15,
  });
  const notifications = data?.notifications ?? [];
  const totalPages = data?.totalPages ?? 1;
  const unreadCount = data?.unreadCount ?? 0;

  // Mutations
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const handleMarkAsRead = (notificationId) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (notificationId) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "warning":
        return <WarningIcon sx={{ color: "#F59E0B" }} />;
      case "promo":
        return <PromoIcon sx={{ color: "#A855F7" }} />;
      case "system":
        return <SystemIcon sx={{ color: "#3B82F6" }} />;
      default:
        return <InfoIcon sx={{ color: "#22C55E" }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "warning":
        return "#F59E0B";
      case "promo":
        return "#A855F7";
      case "system":
        return "#3B82F6";
      default:
        return "#22C55E";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "#FFFFFF", fontFamily: "Inter" }}
          >
            Notifications
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#71717A", fontFamily: "Inter" }}
          >
            {unreadCount > 0
              ? `${unreadCount} unread notification${
                  unreadCount > 1 ? "s" : ""
                }`
              : "All caught up!"}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            sx={{
              color: "#A1A1AA",
              borderColor: "rgba(255,255,255,0.1)",
              "&:hover": { borderColor: "rgba(255,255,255,0.2)" },
            }}
            variant="outlined"
            size="small"
          >
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              sx={{
                bgcolor: "#3B82F6",
                color: "#fff",
                "&:hover": { bgcolor: "#2563EB" },
              }}
              variant="contained"
              size="small"
            >
              Mark all read
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Main Card */}
      <Card
        sx={{
          bgcolor: "#1A1D23",
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <CardHeader
          avatar={<NotificationsIcon sx={{ color: "#3B82F6" }} />}
          title={
            <Typography
              sx={{ fontWeight: 600, color: "#FFFFFF", fontFamily: "Inter" }}
            >
              All Notifications
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Click on a notification to mark it as read
            </Typography>
          }
          sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        />

        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={32} sx={{ color: "#3B82F6" }} />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography sx={{ color: "#EF4444" }}>
                Failed to load notifications
              </Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <NotificationsIcon
                sx={{ fontSize: 48, color: "#3f3f46", mb: 2 }}
              />
              <Typography sx={{ color: "#71717A", fontFamily: "Inter" }}>
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <>
              {notifications.map((notification, index) => (
                <Box key={notification.id}>
                  <Box
                    sx={{
                      p: 2.5,
                      display: "flex",
                      gap: 2,
                      bgcolor: notification.read
                        ? "transparent"
                        : "rgba(59, 130, 246, 0.05)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.02)",
                      },
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (!notification.read) {
                        handleMarkAsRead(notification.id);
                      }
                    }}
                  >
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: `${getNotificationColor(notification.type)}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 0.5 }}
                      >
                        <Typography
                          sx={{
                            fontWeight: notification.read ? 500 : 600,
                            fontSize: 15,
                            color: "#FFFFFF",
                            fontFamily: "Inter",
                          }}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "#3B82F6",
                            }}
                          />
                        )}
                      </Stack>
                      <Typography
                        sx={{
                          color: "#A1A1AA",
                          fontSize: 14,
                          mb: 1,
                          lineHeight: 1.5,
                          fontFamily: "Inter",
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          size="small"
                          label={notification.type}
                          sx={{
                            bgcolor: `${getNotificationColor(
                              notification.type
                            )}15`,
                            color: getNotificationColor(notification.type),
                            fontSize: 11,
                            height: 22,
                            textTransform: "capitalize",
                            fontFamily: "Inter",
                          }}
                        />
                        <Typography
                          sx={{
                            color: "#71717A",
                            fontSize: 12,
                            fontFamily: "Inter",
                          }}
                        >
                          {formatDate(notification.createdAt)}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Actions */}
                    <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                      {!notification.read && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          sx={{ color: "#22C55E" }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        sx={{ color: "#EF4444" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                  {index < notifications.length - 1 && (
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
                  )}
                </Box>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 3,
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, newPage) => setPage(newPage)}
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "#A1A1AA",
                        "&.Mui-selected": {
                          bgcolor: "#3B82F6",
                          color: "#fff",
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminNotificationsPage;
