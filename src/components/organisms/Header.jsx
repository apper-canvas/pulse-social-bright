import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ currentUser, onSearch }) => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    onSearch?.(query);
  };

  const handleCreatePost = () => {
    navigate("/create");
  };

  const handleNotifications = () => {
    navigate("/notifications");
  };

  const handleProfile = () => {
    navigate(`/profile/${currentUser?.username}`);
  };

  const navItems = [
    { name: "Home", icon: "Home", path: "/" },
    { name: "Explore", icon: "Compass", path: "/explore" },
    { name: "Notifications", icon: "Bell", path: "/notifications" },
    { name: "Profile", icon: "User", path: `/profile/${currentUser?.username}` },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              Pulse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="nav-link flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-primary transition-colors"
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreatePost}
              className="hidden sm:flex"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Post
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotifications}
              className="relative"
            >
              <ApperIcon name="Bell" className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleProfile}
            >
              <Avatar
                src={currentUser?.avatar}
                alt={currentUser?.displayName}
                size="sm"
              />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowMobileMenu(false);
                  handleCreatePost();
                }}
                className="w-full mt-4"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;