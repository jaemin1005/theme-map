import React from 'react';

// children에는 icon이 들어간다.
const IconButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-gray-800 bg-opacity-60 hover:bg-opacity-100 rounded-full p-2">
      {children}
    </div>
  );
};

export default IconButton;