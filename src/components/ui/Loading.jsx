import { motion } from "framer-motion";

const Loading = ({ type = "posts" }) => {
  const renderPostSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full shimmer"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2 shimmer"></div>
          <div className="h-3 bg-gray-200 rounded w-24 shimmer"></div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full shimmer"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
      </div>
      <div className="h-48 bg-gray-200 rounded-lg mb-4 shimmer"></div>
      <div className="flex items-center gap-6">
        <div className="h-8 bg-gray-200 rounded-full w-16 shimmer"></div>
        <div className="h-8 bg-gray-200 rounded-full w-20 shimmer"></div>
      </div>
    </div>
  );

  const renderProfileSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full shimmer"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-40 mb-2 shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-3 shimmer"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-28 shimmer"></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-lg shimmer"></div>
        ))}
      </div>
    </div>
  );

  const renderNotificationSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full shimmer"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 shimmer"></div>
              <div className="h-3 bg-gray-200 rounded w-24 shimmer"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSearchSkeleton = () => (
    <div className="space-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full shimmer"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2 shimmer"></div>
              <div className="h-3 bg-gray-200 rounded w-24 shimmer"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded-lg w-20 shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case "profile":
        return renderProfileSkeleton();
      case "notifications":
        return renderNotificationSkeleton();
      case "search":
        return renderSearchSkeleton();
      default:
        return (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {renderPostSkeleton()}
              </motion.div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="animate-pulse">
      {renderContent()}
    </div>
  );
};

export default Loading;