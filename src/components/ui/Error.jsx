import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  type = "general" 
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case "network":
        return "WifiOff";
      case "notfound":
        return "Search";
      case "server":
        return "ServerCrash";
      default:
        return "AlertCircle";
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case "network":
        return "Connection Problem";
      case "notfound":
        return "Not Found";
      case "server":
        return "Server Error";
      default:
        return "Oops! Something went wrong";
    }
  };

  const getErrorMessage = () => {
    switch (type) {
      case "network":
        return "Please check your internet connection and try again.";
      case "notfound":
        return "The content you're looking for couldn't be found.";
      case "server":
        return "We're having some technical difficulties. Please try again later.";
      default:
        return message;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-full p-4 mb-6">
        <ApperIcon 
          name={getErrorIcon()} 
          className="w-12 h-12 text-red-500" 
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {getErrorTitle()}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
        {getErrorMessage()}
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2 inline" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;