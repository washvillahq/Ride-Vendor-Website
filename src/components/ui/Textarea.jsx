import React from 'react';
import { cn } from '../../utils/cn';

const Textarea = React.forwardRef(({ 
  label, 
  error, 
  className, 
  ...props 
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium leading-none">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
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

Textarea.displayName = "Textarea";

export default Textarea;
