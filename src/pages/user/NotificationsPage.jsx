import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
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
  Home as HomeIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  LocalOffer as PromoIcon,
  Settings as SystemIcon,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from "@/hooks/useNotifications";
import { useSession } from "@/hooks/useAuth";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data: session, isLoading: sessionLoading } = useSession();
  const user = session?.user;

  // Fetch notifications
  const { data, isLoading, error } = useNotifications({ page, limit: 10 });
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

  if (sessionLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    navigate("/Login");
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        py: 4,
        px: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          startIcon={<HomeIcon />}
          onClick={() => navigate("/dashboard")}
          sx={{ color: "#666" }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Main Card */}
      <Card
        sx={{
          maxWidth: 800,
          mx: "auto",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <NotificationsIcon sx={{ color: "#fff", fontSize: 32 }} />
            <Box>
              <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600 }}>
                Notifications
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1 ? "s" : ""
                    }`
                  : "All caught up!"}
              </Typography>
            </Box>
          </Box>
          {unreadCount > 0 && (
            <Button
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              sx={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#fff",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
              variant="outlined"
              size="small"
            >
              Mark all read
            </Button>
          )}
        </Box>

        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography sx={{ color: "#EF4444" }}>
                Failed to load notifications
              </Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <NotificationsIcon sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
              <Typography sx={{ color: "#666" }}>
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
                        : "rgba(102, 126, 234, 0.05)",
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.02)",
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
                            color: "#1f2937",
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
                              bgcolor: "#667eea",
                            }}
                          />
                        )}
                      </Stack>
                      <Typography
                        sx={{
                          color: "#666",
                          fontSize: 14,
                          mb: 1,
                          lineHeight: 1.5,
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
                          }}
                        />
                        <Typography sx={{ color: "#999", fontSize: 12 }}>
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
                  {index < notifications.length - 1 && <Divider />}
                </Box>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, newPage) => setPage(newPage)}
                    color="primary"
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

export default NotificationsPage;
