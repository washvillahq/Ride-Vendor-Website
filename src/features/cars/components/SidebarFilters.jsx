import React, { useState, useEffect } from 'react';
import { ListFilter, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';

const SidebarFilters = ({ filters, onFilterChange, onApply }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleLocalChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply();
    setIsMobileOpen(false);
  };

  const minPrice = parseInt(localFilters.minPrice) || 25000;
  const maxPrice = parseInt(localFilters.maxPrice) || 150000;
  const maxLimit = 150000;

  return (
    <div className="bg-white lg:py-4 space-y-8 lg:sticky lg:top-24">
      {/* Mobile Toggle Header */}
      <div className="flex items-center justify-between lg:block px-4">
        <div>
          <h3 className="flex items-center gap-2 font-black text-lg text-[#1A2B3D] tracking-tight">
            <ListFilter className="w-5 h-5" />
            Filters
          </h3>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden h-10 w-10 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 text-[#1A2B3D] active:scale-90 transition-all"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <ListFilter className="w-5 h-5" />}
        </button>
      </div>

      {/* Filters Content */}
      <div className={cn(
        "space-y-8 lg:block transition-all duration-300 overflow-hidden lg:max-h-none px-4",
        isMobileOpen ? "max-h-[2000px] opacity-100 mt-6" : "max-h-0 opacity-0 lg:opacity-100 lg:mt-0"
      )}>
        {/* Price Range */}
        <div className="space-y-6">
          <label className="text-sm font-bold text-[#1A2B3D]">Price Range (Daily)</label>
          <div className="space-y-6 relative h-10">
            <div className="absolute h-[3px] w-full bg-slate-200 rounded-full top-[14px]">
              <div 
                className="absolute h-full bg-[#FDB813] rounded-full" 
                style={{ 
                  left: `${(minPrice / maxLimit) * 100}%`, 
                  right: `${100 - (maxPrice / maxLimit) * 100}%` 
                }} 
              />
            </div>
            
            <input 
              type="range" 
              min="0"
              max={maxLimit}
              step="1000"
              value={minPrice}
              onChange={(e) => {
                const val = Math.min(parseInt(e.target.value), maxPrice - 5000);
                handleLocalChange('minPrice', val);
              }}
              className="absolute top-[8px] left-0 w-full bg-transparent appearance-none pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FDB813] [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none"
            />
            <input 
              type="range" 
              min="0"
              max={maxLimit}
              step="1000"
              value={maxPrice}
              onChange={(e) => {
                const val = Math.max(parseInt(e.target.value), minPrice + 5000);
                handleLocalChange('maxPrice', val);
              }}
              className="absolute top-[8px] left-0 w-full bg-transparent appearance-none pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FDB813] [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none"
            />

            <div className="flex items-center justify-between text-xs font-bold text-[#1A2B3D] mt-8 pt-4">
               <span>₦{minPrice.toLocaleString()}</span>
               <span>₦{maxPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8" />

        {/* Vehicle Type */}
        <div className="space-y-5">
          <label className="text-sm font-bold text-[#1A2B3D]">Vehicle Type</label>
          <div className="space-y-4">
            {['Sedan', 'SUV', 'Luxury', 'Van'].map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-300 text-[#FDB813] focus:ring-[#FDB813] cursor-pointer"
                  checked={localFilters.bodyType === type}
                  onChange={() => handleLocalChange('bodyType', localFilters.bodyType === type ? '' : type)}
                />
                <span className="text-sm font-medium text-slate-600 group-hover:text-[#1A2B3D] transition-colors">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8" />

        {/* Vehicle Brand */}
        <div className="space-y-5">
          <label className="text-sm font-bold text-[#1A2B3D]">Vehicle Brand</label>
          <div className="space-y-4">
            {['Toyota', 'Mercedes', 'Lexus', 'Honda'].map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-300 text-[#FDB813] focus:ring-[#FDB813] cursor-pointer"
                  checked={localFilters.brand === brand}
                  onChange={() => handleLocalChange('brand', localFilters.brand === brand ? '' : brand)}
                />
                <span className="text-sm font-medium text-slate-600 group-hover:text-[#1A2B3D] transition-colors">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8" />

        {/* Transmission */}
        <div className="space-y-5">
          <label className="text-sm font-bold text-[#1A2B3D]">Transmission</label>
          <div className="flex bg-[#F1F1F3] p-1 rounded-xl">
            {['Auto', 'Manual'].map((t) => (
              <button
                key={t}
                onClick={() => handleLocalChange('transmission', t)}
                className={cn(
                  "flex-1 py-3 rounded-lg text-xs font-bold transition-all",
                  localFilters.transmission === t
                    ? "bg-white text-[#1A2B3D] shadow-sm transform scale-[1.02]"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4" />

        <div className="pt-2">
          <Button
            onClick={handleApply}
            className="w-full bg-[#001D24] hover:bg-[#00141a] text-white rounded-xl py-5 font-bold text-sm tracking-tight active:scale-95 transition-all"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
