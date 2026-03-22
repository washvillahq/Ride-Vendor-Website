import React from 'react';
import { cn } from '../../utils/cn';

const LoadingSpinner = ({ size = 'md', className, ...props }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-black border-t-transparent",
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

export default LoadingSpinner;
