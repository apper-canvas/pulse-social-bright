import { useState } from "react";
import { motion } from "framer-motion";
import CreatePostForm from "@/components/molecules/CreatePostForm";
import PostList from "@/components/organisms/PostList";
import Sidebar from "@/components/organisms/Sidebar";
import { postsService } from "@/services/api/postsService";
import { toast } from "react-toastify";

const Home = ({ currentUser }) => {
  const [refreshPosts, setRefreshPosts] = useState(0);

  const handleCreatePost = async (postData) => {
    try {
      await postsService.create(postData);
      setRefreshPosts(prev => prev + 1);
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error("Failed to create post");
      throw error;
    }
  };

  const mockSuggestions = [
    {
      id: 1,
      username: "sarahwilson",
      displayName: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b4e37f1a?w=400&h=400&fit=crop&crop=face",
      bio: "UX Designer & Tech Enthusiast"
    },
    {
      id: 2,
      username: "michaelchen",
      displayName: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Software Engineer at TechCorp"
    },
    {
      id: 3,
      username: "emilyjones",
      displayName: "Emily Jones",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Content Creator & Photographer"
    }
  ];

  const mockTrending = [
    { name: "technology", posts: 1234, growth: "+12%" },
    { name: "design", posts: 891, growth: "+8%" },
    { name: "startup", posts: 567, growth: "+15%" },
    { name: "webdev", posts: 445, growth: "+5%" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 lg:mr-80">
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Create Post Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CreatePostForm
                onPost={handleCreatePost}
                currentUser={currentUser}
              />
            </motion.div>

            {/* Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PostList
                type="all"
                currentUser={currentUser}
                key={refreshPosts}
              />
            </motion.div>
          </div>
        </div>

        {/* Sidebar - Desktop Only */}
        <div className="hidden lg:block fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <Sidebar
            currentUser={currentUser}
            suggestions={mockSuggestions}
            trending={mockTrending}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;