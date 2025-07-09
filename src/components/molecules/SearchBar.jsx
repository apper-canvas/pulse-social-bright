import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ onSearch, placeholder = "Search users and posts...", className }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim()) {
      onSearch(e.target.value.trim());
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={cn("relative flex-1 max-w-md", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-200",
            isFocused ? "text-primary" : "text-gray-400"
          )}
        />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "pl-10 pr-4 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-200",
            isFocused && "ring-2 ring-primary/20 border-primary"
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onSearch("");
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default SearchBar;