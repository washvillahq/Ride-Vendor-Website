import React from 'react';
import { cn } from '../../utils/cn';

const EmptyState = ({
  title = "No results found",
  description = "Try adjusting your filters or search terms.",
  icon,
  action,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="bg-slate-50 p-6 rounded-full mb-4">
        {icon || (
          <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4m16 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1m16-4H4" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 max-w-[250px] mt-2 mb-6">
        {description}
      </p>
      {action && (
        !React.isValidElement(action) && typeof action === 'object' && action.label ? (
          <button
            onClick={action.onClick}
            className="px-6 py-2 bg-slate-900 text-white text-xs font-medium uppercase tracking-widest rounded-xl hover:bg-accent hover:text-primary transition-all shadow-lg shadow-slate-200"
          >
            {action.label}
          </button>
        ) : action
      )}
    </div>
  );
};

export default EmptyState;
