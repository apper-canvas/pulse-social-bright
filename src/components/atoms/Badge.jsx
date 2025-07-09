import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default",
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20",
    secondary: "bg-gray-100 text-gray-800 border border-gray-200",
    accent: "bg-gradient-to-r from-accent/10 to-pink-600/10 text-accent border border-accent/20",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    error: "bg-red-100 text-red-800 border border-red-200"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs rounded-md",
    default: "px-2.5 py-1.5 text-xs rounded-lg",
    lg: "px-3 py-2 text-sm rounded-lg"
  };

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Badge.displayName = "Badge";

export default Badge;