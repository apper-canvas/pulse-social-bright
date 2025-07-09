import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { postsService } from "@/services/api/postsService";

const CreatePost = ({ currentUser }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Please write something to post");
      return;
    }

    setIsLoading(true);
    
    try {
      const postData = {
        content: content.trim(),
        media: selectedMedia ? [selectedMedia] : [],
        hashtags: extractHashtags(content)
      };
      
      await postsService.create(postData);
      toast.success("Post created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  const extractHashtags = (text) => {
    const hashtagRegex = /#(\w+)/g;
    const hashtags = [];
    let match;
    
    while ((match = hashtagRegex.exec(text)) !== null) {
      hashtags.push(match[1]);
    }
    
    return hashtags;
  };

  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedMedia({
          type: file.type.startsWith("image/") ? "image" : "video",
          url: event.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-700"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <Avatar
              src={currentUser?.avatar}
              alt={currentUser?.displayName}
              size="default"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-2">
                {currentUser?.displayName}
              </p>
              <Textarea
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] resize-none border-gray-200 focus:border-primary focus:ring-primary/20 text-lg"
                maxLength={280}
              />
            </div>
          </div>

          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-xl overflow-hidden"
            >
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.url}
                  alt="Selected media"
                  className="w-full h-80 object-cover"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  className="w-full h-80 object-cover"
                  controls
                />
              )}
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaSelect}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <ApperIcon name="ImagePlus" className="w-5 h-5" />
                  <span className="font-medium">Add Media</span>
                </div>
              </label>
              
              <div className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer">
                <ApperIcon name="Hash" className="w-5 h-5" />
                <span className="font-medium">Hashtag</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {280 - content.length} characters remaining
              </span>
              <Button
                type="submit"
                disabled={!content.trim() || isLoading}
                className="px-8"
              >
                {isLoading ? (
                  <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                )}
                Post
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePost;