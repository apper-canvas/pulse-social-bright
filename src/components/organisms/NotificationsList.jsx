import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Notifications from "@/components/pages/Notifications";
import NotificationItem from "@/components/molecules/NotificationItem";
import { notificationsService } from "@/services/api/notificationsService";

const NotificationsList = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await notificationsService.getByUserId(currentUser.id);
      setNotifications(data);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    }
  }, [currentUser]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead(currentUser.id);
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return <Loading type="notifications" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadNotifications} type="general" />;
  }

  if (notifications.length === 0) {
    return (
      <Empty
        type="notifications"
        onAction={() => window.location.href = "/explore"}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2"
          >
            <ApperIcon name="CheckCheck" className="w-4 h-4" />
            Mark all as read
          </Button>
        )}
      </div>
</div>

      <div className="space-y-2">
        {notifications?.map((notification, index) => (
          <motion.div
            key={notification?.id ? `notification-${notification.id}` : `notification-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <NotificationItem
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          </motion.div>
        ))}
    </div>
  );
};

export default NotificationsList;