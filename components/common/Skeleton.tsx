import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rect',
  width,
  height
}) => {
  const baseStyles = "animate-pulse bg-slate-800/50 rounded";
  
  const variantStyles = {
    text: "h-4 rounded-md",
    rect: "rounded-lg",
    circle: "rounded-full"
  };

  const style = {
    width: width,
    height: height
  };

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`} 
      style={style}
    />
  );
};

export default Skeleton;