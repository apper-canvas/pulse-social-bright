import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const navigate = useNavigate();
  const [isRead, setIsRead] = useState(notification.read);

  const getNotificationIcon = () => {
    switch (notification.type) {
      case "like":
        return { name: "Heart", color: "text-red-500", bg: "bg-red-50" };
      case "comment":
        return { name: "MessageCircle", color: "text-blue-500", bg: "bg-blue-50" };
      case "follow":
        return { name: "UserPlus", color: "text-green-500", bg: "bg-green-50" };
      case "mention":
        return { name: "AtSign", color: "text-purple-500", bg: "bg-purple-50" };
      default:
        return { name: "Bell", color: "text-gray-500", bg: "bg-gray-50" };
    }
  };

  const getNotificationText = () => {
    switch (notification.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "follow":
        return "started following you";
      case "mention":
        return "mentioned you in a post";
      default:
        return "interacted with your content";
    }
  };

  const handleClick = () => {
    if (!isRead) {
      setIsRead(true);
      onMarkAsRead?.(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "like":
      case "comment":
        navigate(`/post/${notification.targetId}`);
        break;
      case "follow":
        navigate(`/profile/${notification.actor.username}`);
        break;
      default:
        break;
    }
  };

  const icon = getNotificationIcon();

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md",
        isRead 
          ? "bg-white border-gray-100 hover:border-gray-200" 
          : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300"
      )}
    >
      <div className="relative">
        <Avatar
          src={notification.actor.avatar}
          alt={notification.actor.displayName}
          size="default"
        />
        <div className={cn(
          "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white",
          icon.bg
        )}>
          <ApperIcon name={icon.name} className={cn("w-3 h-3", icon.color)} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">
            {notification.actor.displayName}
          </span>
          <span className="text-gray-600">{getNotificationText()}</span>
          {!isRead && (
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>

      {notification.type === "follow" && (
        <div className="text-right">
          <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
        </div>
      )}
    </motion.div>
  );
};

export default NotificationItem;