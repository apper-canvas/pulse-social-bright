import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import UserCard from "@/components/molecules/UserCard";
import PostCard from "@/components/organisms/PostCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { searchService } from "@/services/api/searchService";
import { cn } from "@/utils/cn";

const SearchResults = ({ currentUser }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState({
    users: [],
    posts: [],
    hashtags: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResults = async () => {
    if (!query.trim()) {
      setResults({ users: [], posts: [], hashtags: [] });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const data = await searchService.search(query);
      setResults(data);
    } catch (err) {
      setError(err.message || "Failed to search");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, [query]);

  const tabs = [
    { id: "all", label: "All", icon: "Search" },
    { id: "users", label: "People", icon: "Users" },
    { id: "posts", label: "Posts", icon: "FileText" },
    { id: "hashtags", label: "Hashtags", icon: "Hash" }
  ];

  const getResultsForTab = () => {
    switch (activeTab) {
      case "users":
        return results.users;
      case "posts":
        return results.posts;
      case "hashtags":
        return results.hashtags;
      default:
        return [
          ...results.users.slice(0, 3),
          ...results.posts.slice(0, 5),
          ...results.hashtags.slice(0, 3)
        ];
    }
  };

  const handleLike = async (postId, isLiked) => {
    // Handle like functionality
    console.log("Like post:", postId, isLiked);
  };

  const handleComment = (postId) => {
    window.location.href = `/post/${postId}`;
  };

  const handleShare = (postId) => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
  };

  if (loading) {
    return <Loading type="search" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadResults} type="general" />;
  }

  const hasResults = results.users.length > 0 || results.posts.length > 0 || results.hashtags.length > 0;

  if (!query.trim()) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-full p-6 w-24 h-24 mx-auto mb-6">
            <ApperIcon name="Search" className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Search Pulse
          </h3>
          <p className="text-gray-600">
            Find people, posts, and trending topics
          </p>
        </div>
      </div>
    );
  }

  if (!hasResults) {
    return (
      <Empty
        type="search"
        title="No results found"
        message={`No results found for "${query}". Try different keywords or explore trending content.`}
        onAction={() => window.location.href = "/explore"}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Search Results
        </h1>
        <p className="text-gray-600">
          Results for "{query}"
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-600 hover:text-gray-900"
            )}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-6">
        {activeTab === "all" && (
          <>
            {results.users.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">People</h2>
                <div className="grid gap-4">
                  {results.users.slice(0, 3).map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </div>
            )}

            {results.posts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Posts</h2>
                <div className="space-y-4">
                  {results.posts.slice(0, 5).map((post) => (
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

            {results.hashtags.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hashtags</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.hashtags.slice(0, 3).map((hashtag) => (
                    <div
                      key={hashtag.name}
                      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                          <ApperIcon name="Hash" className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            #{hashtag.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {hashtag.postsCount} posts
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "users" && (
          <div className="grid gap-4">
            {results.users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <UserCard user={user} />
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "posts" && (
          <div className="space-y-4">
            {results.posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
        )}

        {activeTab === "hashtags" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.hashtags.map((hashtag) => (
              <motion.div
                key={hashtag.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="Hash" className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      #{hashtag.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {hashtag.postsCount} posts
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;