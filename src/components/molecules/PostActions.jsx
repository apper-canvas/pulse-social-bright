import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const PostActions = ({ 
  postId, 
  isLiked: initialLiked = false, 
  likesCount = 0, 
  commentsCount = 0, 
  onLike, 
  onComment, 
  onShare,
  className 
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(likesCount);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : prev - 1);
    
    try {
      await onLike?.(postId, newLikedState);
    } catch (error) {
      // Revert on error
      setIsLiked(!newLikedState);
      setLikes(prev => newLikedState ? prev - 1 : prev + 1);
    }
    
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleComment = () => {
    onComment?.(postId);
  };

  const handleShare = () => {
    onShare?.(postId);
  };

  return (
    <div className={cn("flex items-center gap-6", className)}>
      <motion.div 
        className="flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            "like-button p-2 rounded-full transition-all duration-200",
            isLiked 
              ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100" 
              : "text-gray-600 hover:text-red-500 hover:bg-red-50"
          )}
        >
          <motion.div
            animate={isAnimating && isLiked ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ApperIcon 
              name={isLiked ? "Heart" : "Heart"} 
              className={cn(
                "w-5 h-5",
                isLiked && "fill-current"
              )}
            />
          </motion.div>
        </Button>
        {likes > 0 && (
          <span className="text-sm font-medium text-gray-600">
            {likes.toLocaleString()}
          </span>
        )}
      </motion.div>

      <motion.div 
        className="flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleComment}
          className="p-2 rounded-full text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200"
        >
          <ApperIcon name="MessageCircle" className="w-5 h-5" />
        </Button>
        {commentsCount > 0 && (
          <span className="text-sm font-medium text-gray-600">
            {commentsCount.toLocaleString()}
          </span>
        )}
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="p-2 rounded-full text-gray-600 hover:text-green-500 hover:bg-green-50 transition-all duration-200"
        >
          <ApperIcon name="Share" className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default PostActions;