import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, Trash2, ExternalLink } from "lucide-react";
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from "@/hooks/useNotifications";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  const { data: unreadCount = 0 } = useUnreadCount();
  const { data, isLoading } = useNotifications({ page: 1, limit: 5 });
  const notifications = data?.notifications ?? [];

  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = (e, notificationId) => {
    e.stopPropagation();
    markAsReadMutation.mutate(notificationId);
  };

  const handleDelete = (e, notificationId) => {
    e.stopPropagation();
    deleteNotificationMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
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

  const getTypeColor = (type) => {
    switch (type) {
      case "warning":
        return "tw:bg-amber-500";
      case "promo":
        return "tw:bg-purple-500";
      case "system":
        return "tw:bg-blue-500";
      default:
        return "tw:bg-green-500";
    }
  };

  return (
    <div className="tw:relative" ref={popoverRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="tw:relative tw:p-2 tw:rounded-full tw:hover:bg-gray-100 tw:transition-colors"
      >
        <Bell size={20} className="tw:text-gray-600" />
        {unreadCount > 0 && (
          <span className="tw:absolute tw:top-0 tw:right-0 tw:w-5 tw:h-5 tw:bg-red-500 tw:text-white tw:text-xs tw:font-medium tw:rounded-full tw:flex tw:items-center tw:justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="tw:absolute tw:right-0 tw:top-full tw:mt-2 tw:w-80 tw:md:w-96 tw:bg-white tw:rounded-xl tw:shadow-xl tw:border tw:border-gray-200 tw:z-50 tw:overflow-hidden">
          {/* Header */}
          <div className="tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-3 tw:border-b tw:border-gray-100 tw:bg-gray-50">
            <h3 className="tw:font-semibold tw:text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="tw:text-xs tw:text-blue-600 tw:hover:text-blue-700 tw:font-medium tw:disabled:opacity-50"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="tw:max-h-80 tw:overflow-y-auto">
            {isLoading ? (
              <div className="tw:flex tw:justify-center tw:py-8">
                <div className="tw:w-6 tw:h-6 tw:border-2 tw:border-blue-500 tw:border-t-transparent tw:rounded-full tw:animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="tw:text-center tw:py-8 tw:px-4">
                <Bell
                  size={32}
                  className="tw:mx-auto tw:text-gray-300 tw:mb-2"
                />
                <p className="tw:text-gray-500 tw:text-sm">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`tw:px-4 tw:py-3 tw:border-b tw:border-gray-50 tw:hover:bg-gray-50 tw:transition-colors tw:cursor-pointer ${
                    !notification.read ? "tw:bg-blue-50/50" : ""
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsReadMutation.mutate(notification.id);
                    }
                  }}
                >
                  <div className="tw:flex tw:gap-3">
                    {/* Type indicator */}
                    <div
                      className={`tw:w-2 tw:h-2 tw:rounded-full tw:mt-2 tw:flex-shrink-0 ${getTypeColor(
                        notification.type
                      )}`}
                    />

                    {/* Content */}
                    <div className="tw:flex-1 tw:min-w-0">
                      <div className="tw:flex tw:items-start tw:justify-between tw:gap-2">
                        <p
                          className={`tw:text-sm tw:line-clamp-1 ${
                            notification.read
                              ? "tw:text-gray-700"
                              : "tw:text-gray-900 tw:font-medium"
                          }`}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="tw:w-2 tw:h-2 tw:bg-blue-500 tw:rounded-full tw:flex-shrink-0 tw:mt-1.5" />
                        )}
                      </div>
                      <p className="tw:text-xs tw:text-gray-500 tw:line-clamp-2 tw:mt-0.5">
                        {notification.message}
                      </p>
                      <div className="tw:flex tw:items-center tw:justify-between tw:mt-1.5">
                        <span className="tw:text-xs tw:text-gray-400">
                          {formatDate(notification.createdAt)}
                        </span>
                        <div className="tw:flex tw:gap-1">
                          {!notification.read && (
                            <button
                              onClick={(e) =>
                                handleMarkAsRead(e, notification.id)
                              }
                              className="tw:p-1 tw:rounded tw:hover:bg-gray-200 tw:text-green-600"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDelete(e, notification.id)}
                            className="tw:p-1 tw:rounded tw:hover:bg-gray-200 tw:text-red-500"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <Link
            to="/dashboard/notifications"
            onClick={() => setIsOpen(false)}
            className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-3 tw:text-sm tw:text-blue-600 tw:hover:bg-gray-50 tw:border-t tw:border-gray-100 tw:!no-underline"
          >
            View all notifications
            <ExternalLink size={14} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
