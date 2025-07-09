import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const UserCard = ({ 
  user, 
  showFollowButton = true, 
  size = "default",
  className 
}) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Follow error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    navigate(`/profile/${user.username}`);
  };

  const cardContent = (
    <>
      <div className="flex items-center gap-3">
        <Avatar
          src={user.avatar}
          alt={user.displayName}
          size={size === "sm" ? "default" : "lg"}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {user.displayName}
            </h3>
            {user.isVerified && (
              <ApperIcon name="BadgeCheck" className="w-4 h-4 text-blue-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">@{user.username}</p>
          {user.bio && size !== "sm" && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>
        {showFollowButton && (
          <Button
            variant={isFollowing ? "secondary" : "primary"}
            size="sm"
            onClick={handleFollow}
            disabled={isLoading}
            className="shrink-0"
          >
            {isLoading ? (
              <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {isFollowing ? (
                  <>
                    <ApperIcon name="UserCheck" className="w-4 h-4 mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
                    Follow
                  </>
                )}
              </>
            )}
          </Button>
        )}
      </div>
    </>
  );

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "bg-white rounded-xl border border-gray-100 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-gray-200",
        className
      )}
    >
      {cardContent}
    </motion.div>
  );
};

export default UserCard;