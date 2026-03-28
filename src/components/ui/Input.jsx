import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({
  label,
  error,
  icon,
  suffix,
  className,
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-[11px] font-medium uppercase tracking-widest text-slate-500 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-2 text-sm font-bold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            icon && "pl-12",
            suffix && "pr-12",
            error ? "border-red-500 bg-red-50/50 focus-visible:border-red-500 focus-visible:ring-red-500/10" : "hover:border-slate-100",
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent transition-colors">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[10px] font-medium uppercase tracking-wider text-red-500 mt-1.5 ml-1">
          {error.message || error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
