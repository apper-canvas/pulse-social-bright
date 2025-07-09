import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ currentUser, suggestions = [], trending = [] }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

const sidebarItems = [
    { name: "Home", icon: "Home", path: "/" },
    { name: "Explore", icon: "Compass", path: "/explore" },
    { name: "Messages", icon: "MessageCircle", path: "/messages" },
    { name: "Notifications", icon: "Bell", path: "/notifications" },
    { name: "Profile", icon: "User", path: `/profile/${currentUser?.username}` },
  ];

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 space-y-6">
      {/* User Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <Avatar
            src={currentUser?.avatar}
            alt={currentUser?.displayName}
            size="lg"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {currentUser?.displayName}
            </h3>
            <p className="text-sm text-gray-600">@{currentUser?.username}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="text-center">
            <p className="font-semibold text-gray-900">1,234</p>
            <p className="text-gray-600">Posts</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900">5,678</p>
            <p className="text-gray-600">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900">890</p>
            <p className="text-gray-600">Following</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        {sidebarItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "nav-link flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
              isActive(item.path)
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                : "text-gray-600 hover:text-primary hover:bg-white/50"
            )}
          >
            <ApperIcon name={item.icon} className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </motion.nav>

      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <h3 className="font-semibold text-gray-900 mb-4">Trending</h3>
        <div className="space-y-3">
          {trending.map((topic, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">#{topic.name}</p>
                <p className="text-sm text-gray-600">{topic.posts} posts</p>
              </div>
              <Badge variant="secondary" size="sm">
                {topic.growth}
              </Badge>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Who to Follow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <h3 className="font-semibold text-gray-900 mb-4">Who to Follow</h3>
        <div className="space-y-4">
          {suggestions.map((user, index) => (
            <div key={index} className="flex items-center gap-3">
              <Avatar
                src={user.avatar}
                alt={user.displayName}
                size="default"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user.displayName}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  @{user.username}
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;