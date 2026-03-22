import React from 'react';
import { cn } from '../../utils/cn';

const Checkbox = React.forwardRef(({ 
  label, 
  error, 
  className, 
  ...props 
}, ref) => {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "h-4 w-4 rounded border-slate-300 text-black focus:ring-black accent-black transition-all",
            className
          )}
          {...props}
        />
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 pl-6">
          {error.message || error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
