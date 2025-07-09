import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Inbox", 
  title = "Nothing here yet", 
  message = "Start by creating your first post", 
  actionText = "Create Post",
  onAction,
  type = "general"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "posts":
        return {
          icon: "FileText",
          title: "No posts yet",
          message: "Share your first thought with the world!",
          actionText: "Create Post"
        };
      case "followers":
        return {
          icon: "Users",
          title: "No followers yet",
          message: "Start connecting with people to build your network",
          actionText: "Find People"
        };
      case "following":
        return {
          icon: "UserPlus",
          title: "Not following anyone",
          message: "Discover interesting people and content",
          actionText: "Explore"
        };
      case "notifications":
        return {
          icon: "Bell",
          title: "No notifications",
          message: "You're all caught up! New notifications will appear here",
          actionText: null
        };
      case "search":
        return {
          icon: "Search",
          title: "No results found",
          message: "Try adjusting your search or explore trending content",
          actionText: "Clear Search"
        };
      case "comments":
        return {
          icon: "MessageCircle",
          title: "No comments yet",
          message: "Be the first to share your thoughts!",
          actionText: "Add Comment"
        };
      default:
        return { icon, title, message, actionText };
    }
  };

  const content = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-full p-6 mb-6">
        <ApperIcon 
          name={content.icon} 
          className="w-16 h-16 text-gray-400" 
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
        {content.message}
      </p>
      
      {content.actionText && onAction && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2 inline" />
          {content.actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;