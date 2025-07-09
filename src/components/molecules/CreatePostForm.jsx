import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CreatePostForm = ({ onPost, currentUser, className }) => {
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
      
      await onPost(postData);
      setContent("");
      setSelectedMedia(null);
      toast.success("Post created successfully!");
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 p-6",
        className
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <Avatar
            src={currentUser?.avatar}
            alt={currentUser?.displayName}
            size="default"
          />
          <div className="flex-1">
            <Textarea
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none border-none focus:ring-0 p-0 text-lg placeholder:text-gray-500"
              maxLength={280}
            />
          </div>
        </div>

        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-lg overflow-hidden"
          >
            {selectedMedia.type === "image" ? (
              <img
                src={selectedMedia.url}
                alt="Selected media"
                className="w-full h-64 object-cover"
              />
            ) : (
              <video
                src={selectedMedia.url}
                className="w-full h-64 object-cover"
                controls
              />
            )}
            <button
              type="button"
              onClick={removeMedia}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaSelect}
                className="hidden"
              />
              <div className="flex items-center gap-2 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <ApperIcon name="ImagePlus" className="w-4 h-4" />
                <span className="text-sm font-medium">Media</span>
              </div>
            </label>
            
            <div className="flex items-center gap-2 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer">
              <ApperIcon name="Hash" className="w-4 h-4" />
              <span className="text-sm font-medium">Hashtag</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={cn(
              "text-sm",
              content.length > 250 ? "text-red-500" : "text-gray-500"
            )}>
              {280 - content.length}
            </span>
            <Button
              type="submit"
              disabled={!content.trim() || isLoading}
              className="px-6"
            >
              {isLoading ? (
                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CreatePostForm;