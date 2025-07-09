import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import PostCard from "@/components/organisms/PostCard";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { postsService } from "@/services/api/postsService";

const PostList = ({ userId, type = "all", currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");
      
      let data;
      if (type === "user" && userId) {
        data = await postsService.getByUserId(userId);
      } else {
        data = await postsService.getAll();
      }
      
      setPosts(data);
    } catch (err) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [userId, type]);

  const handleLike = async (postId, isLiked) => {
    try {
      await postsService.toggleLike(postId, isLiked);
      // Update local state
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                likes: isLiked ? post.likes + 1 : post.likes - 1,
                isLiked: isLiked
              }
            : post
        )
      );
    } catch (error) {
      toast.error("Failed to update like");
      throw error;
    }
  };

  const handleComment = (postId) => {
    // Navigate to post detail page to show comments
    window.location.href = `/post/${postId}`;
  };

  const handleShare = async (postId) => {
    try {
      await navigator.share({
        title: "Check out this post on Pulse",
        url: `${window.location.origin}/post/${postId}`
      });
    } catch (error) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return <Loading type="posts" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPosts} type="general" />;
  }

if (posts.length === 0) {
    return (
      <Empty
        type="posts"
        onAction={() => window.location.href = "/create"}
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts
        .filter(post => post && typeof post === 'object')
        .map((post, index) => (
          <motion.div
            key={post.id || `post-${post.timestamp || Date.now()}-${post.author?.id || 'unknown'}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PostCard
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              currentUser={currentUser}
            />
          </motion.div>
        ))}
    </div>
  );
};

export default PostList;