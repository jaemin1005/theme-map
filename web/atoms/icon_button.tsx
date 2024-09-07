import React from "react";

// children에는 icon이 들어간다.
const IconButton: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div  className={`group bg-gray-800 bg-opacity-60 hover:bg-opacity-100 rounded-full p-2 ${className}`}>
      {children}
    </div>
  );
};

export default IconButton;
