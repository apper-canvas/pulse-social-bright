import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import UserCard from "@/components/molecules/UserCard";
import PostCard from "@/components/organisms/PostCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { usersService } from "@/services/api/usersService";
import { postsService } from "@/services/api/postsService";
import { cn } from "@/utils/cn";

const Explore = ({ currentUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("trending");
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExploreData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [posts, users] = await Promise.all([
        postsService.getTrending(),
        usersService.getSuggested(currentUser?.id)
      ]);
      
      setTrendingPosts(posts);
      setSuggestedUsers(users);
      
      // Mock trending hashtags
      setTrendingHashtags([
        { name: "technology", postsCount: 1234, growth: "+12%" },
        { name: "design", postsCount: 891, growth: "+8%" },
        { name: "startup", postsCount: 567, growth: "+15%" },
        { name: "webdev", postsCount: 445, growth: "+5%" },
        { name: "ai", postsCount: 332, growth: "+25%" },
        { name: "react", postsCount: 289, growth: "+18%" }
      ]);
    } catch (err) {
      setError(err.message || "Failed to load explore data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExploreData();
  }, [currentUser]);

  const handleLike = async (postId, isLiked) => {
    console.log("Like post:", postId, isLiked);
  };

  const handleComment = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleShare = (postId) => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
  };

  const handleHashtagClick = (hashtag) => {
    navigate(`/search?q=${encodeURIComponent(`#${hashtag}`)}`);
  };

  const tabs = [
    { id: "trending", label: "Trending", icon: "TrendingUp" },
    { id: "people", label: "People", icon: "Users" },
    { id: "hashtags", label: "Hashtags", icon: "Hash" }
  ];

  if (loading) {
    return <Loading type="posts" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadExploreData} type="general" />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Explore Pulse
        </h1>
        <p className="text-gray-600">
          Discover trending content and connect with new people
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-2 border-b border-gray-200 bg-white rounded-t-xl p-4"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200",
              activeTab === tab.id
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {activeTab === "trending" && (
          <div className="bg-white rounded-b-xl rounded-t-none border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Trending Posts
            </h2>
            <div className="space-y-6">
              {trendingPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "people" && (
          <div className="bg-white rounded-b-xl rounded-t-none border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              People You Might Know
            </h2>
            <div className="grid gap-4">
              {suggestedUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "hashtags" && (
          <div className="bg-white rounded-b-xl rounded-t-none border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Trending Hashtags
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingHashtags.map((hashtag) => (
                <motion.div
                  key={hashtag.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleHashtagClick(hashtag.name)}
                  className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                        <ApperIcon name="Hash" className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          #{hashtag.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {hashtag.postsCount.toLocaleString()} posts
                        </p>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">
                      {hashtag.growth}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ApperIcon name="TrendingUp" className="w-4 h-4" />
                    <span>Trending in your area</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Explore;