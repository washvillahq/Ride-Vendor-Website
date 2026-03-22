import React from 'react';
import { cn } from '../../utils/cn';

const Select = React.forwardRef(({ 
  label, 
  error, 
  options = [], 
  className, 
  placeholder = 'Select an option',
  ...props 
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium leading-none">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-black",
          className
        )}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs font-medium text-red-500 mt-1">
          {error.message || error}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
