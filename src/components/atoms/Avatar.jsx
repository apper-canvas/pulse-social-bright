import React from "react";
import { cn } from "@/utils/cn";

const Avatar = React.forwardRef(({ 
  className, 
  src, 
  alt = "Avatar", 
  size = "default",
  hasStory = false,
  ...props 
}, ref) => {
  const sizes = {
    sm: "w-8 h-8",
    default: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20"
  };

  const avatarContent = (
    <div
      ref={ref}
      className={cn(
        "relative flex items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
          <span className="text-primary font-medium text-sm">
            {alt.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );

  if (hasStory) {
    return (
      <div className="story-ring p-0.5">
        {avatarContent}
      </div>
    );
  }

  return avatarContent;
});

Avatar.displayName = "Avatar";

export default Avatar;