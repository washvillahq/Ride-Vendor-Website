import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ 
  label, 
  error, 
  className, 
  type = 'text', 
  ...props 
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          error ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-black",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-red-500 mt-1">
          {error.message || error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
