import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className 
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "h-10 w-10 flex items-center justify-center rounded-full text-xs font-bold transition-all",
              currentPage === p
                ? "bg-[#FDB813] text-primary"
                : "bg-white border border-slate-100 text-slate-400 hover:border-slate-300 hover:text-primary"
            )}
          >
            {p}
          </button>
        ))}
        {totalPages > 5 && <span className="text-slate-300">...</span>}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
