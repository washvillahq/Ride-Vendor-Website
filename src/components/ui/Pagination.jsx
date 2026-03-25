import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className 
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumber = (page) => {
    const isActive = currentPage === page;
    return (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={cn(
          "h-12 w-12 flex items-center justify-center rounded-2xl text-sm font-black transition-all",
          isActive 
            ? "bg-[#FDB813] text-[#1A2B3D] shadow-lg shadow-yellow-500/20 active:scale-90" 
            : "text-[#1A2B3D] hover:text-[#FDB813] active:scale-95"
        )}
      >
        {page}
      </button>
    );
  };

  const pages = [];
  const range = 1; // Number of pages to show around current page

  // Always show first page
  pages.push(renderPageNumber(1));

  if (currentPage > range + 2) {
    pages.push(<span key="dots-1" className="text-slate-400 font-black px-2">...</span>);
  }

  // Show pages around current
  for (let i = Math.max(2, currentPage - range); i <= Math.min(totalPages - 1, currentPage + range); i++) {
    pages.push(renderPageNumber(i));
  }

  if (currentPage < totalPages - range - 1) {
    pages.push(<span key="dots-2" className="text-slate-400 font-black px-2">...</span>);
  }

  // Always show last page if more than 1
  if (totalPages > 1) {
    pages.push(renderPageNumber(totalPages));
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-100 bg-white text-[#1A2B3D] hover:border-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm active:scale-90"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1">
        {pages}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-100 bg-white text-[#1A2B3D] hover:border-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm active:scale-90"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
