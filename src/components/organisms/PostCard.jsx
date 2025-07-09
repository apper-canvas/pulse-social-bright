import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import PostActions from "@/components/molecules/PostActions";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PostCard = ({ post, onLike, onComment, onShare, currentUser }) => {
  const navigate = useNavigate();
  const [showFullContent, setShowFullContent] = useState(false);
  
  const isLongContent = post.content.length > 200;
  const displayContent = isLongContent && !showFullContent 
    ? post.content.substring(0, 200) + "..."
    : post.content;

  const handleUserClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${post.author.username}`);
  };

  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleHashtagClick = (hashtag) => {
    navigate(`/search?q=${encodeURIComponent(`#${hashtag}`)}`);
  };

  const renderContent = () => {
    const hashtagRegex = /#(\w+)/g;
    const parts = displayContent.split(hashtagRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              handleHashtagClick(part);
            }}
            className="text-primary hover:text-primary/80 cursor-pointer font-medium"
          >
            #{part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="post-card bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer"
      onClick={handlePostClick}
    >
      <div className="flex items-start gap-3">
        <div onClick={handleUserClick}>
          <Avatar
            src={post.author.avatar}
            alt={post.author.displayName}
            size="default"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 
              className="font-semibold text-gray-900 hover:text-primary cursor-pointer"
              onClick={handleUserClick}
            >
              {post.author.displayName}
            </h3>
            {post.author.isVerified && (
              <ApperIcon name="BadgeCheck" className="w-4 h-4 text-blue-500" />
            )}
            <span className="text-gray-500">@{post.author.username}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500 text-sm">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
              {renderContent()}
            </p>
            {isLongContent && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullContent(!showFullContent);
                }}
                className="text-primary hover:text-primary/80 text-sm font-medium mt-2"
              >
                {showFullContent ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          {post.media && post.media.length > 0 && (
            <div className="mb-4 rounded-lg overflow-hidden">
              {post.media[0].type === "image" ? (
                <img
                  src={post.media[0].url}
                  alt="Post media"
                  className="w-full h-80 object-cover"
                />
              ) : (
                <video
                  src={post.media[0].url}
                  className="w-full h-80 object-cover"
                  controls
                />
              )}
            </div>
          )}

          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.hashtags.map((hashtag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHashtagClick(hashtag);
                  }}
                >
                  #{hashtag}
                </Badge>
              ))}
            </div>
          )}

          <PostActions
            postId={post.id}
            isLiked={post.isLiked}
            likesCount={post.likes}
            commentsCount={post.comments}
            onLike={onLike}
            onComment={onComment}
            onShare={onShare}
          />
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;