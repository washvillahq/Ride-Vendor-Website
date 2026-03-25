import React, { useState, useEffect } from 'react';
import { ListFilter, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';

const SidebarFilters = ({ filters, onFilterChange, onApply, maxPriceLimit }) => {
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

  const maxLimit = maxPriceLimit || 150000;
  const isSale = maxLimit > 1000000;
  
  const minPrice = parseInt(localFilters.minPrice) || 0;
  const maxPrice = parseInt(localFilters.maxPrice) || (isSale ? maxLimit : 150000);
  const step = isSale ? 50000 : 1000;

  return (
    <div className="bg-white lg:py-6 space-y-10 lg:sticky lg:top-24">
      {/* Mobile Toggle Header */}
      <div className="flex items-center justify-between lg:block px-4">
        <div>
          <h3 className="flex items-center gap-3 font-medium text-xl text-[#1A2B3D] tracking-tight">
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <ListFilter className="w-5 h-5 text-slate-400" />
            </div>
            Search Filters
          </h3>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden h-12 w-12 flex items-center justify-center bg-[#FDB813] text-[#1A2B3D] rounded-2xl shadow-xl shadow-yellow-500/10 active:scale-90 transition-all"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <ListFilter className="w-6 h-6" />}
        </button>
      </div>

      {/* Filters Content */}
      <div className={cn(
        "space-y-10 lg:block transition-all duration-500 overflow-hidden lg:max-h-none",
        isMobileOpen ? "max-h-[2000px] opacity-100 mt-8 px-4" : "max-h-0 opacity-0 lg:opacity-100 lg:mt-0 lg:px-4"
      )}>
        {/* Price Range */}
        <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest px-1">
            {isSale ? 'Price Range' : 'Daily Rate'}
          </label>
          <div className="space-y-8 relative px-2 pt-2">
            <div className="absolute h-[4px] w-full bg-slate-200 rounded-full top-[14px]">
              <div
                className="absolute h-full bg-[#FDB813] rounded-full shadow-[0_0_10px_rgba(253,184,19,0.3)]"
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
              step={step}
              value={minPrice}
              onChange={(e) => {
                const val = Math.min(parseInt(e.target.value), maxPrice - (isSale ? 500000 : 5000));
                handleLocalChange('minPrice', val);
              }}
              className="absolute top-[6px] left-0 w-full bg-transparent appearance-none pointer-events-none z-20 cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-[#FDB813] [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:appearance-none transition-transform hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-125"
            />
            <input
              type="range"
              min="0"
              max={maxLimit}
              step={step}
              value={maxPrice}
              onChange={(e) => {
                const val = Math.max(parseInt(e.target.value), minPrice + (isSale ? 500000 : 5000));
                handleLocalChange('maxPrice', val);
              }}
              className="absolute top-[6px] left-0 w-full bg-transparent appearance-none pointer-events-none z-20 cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-[#FDB813] [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:appearance-none transition-transform hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-125"
            />

            <div className="flex items-center justify-between mt-10">
              <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                <span className="text-[9px] font-medium text-slate-400 uppercase block mb-0.5">Min</span>
                <span className="text-sm font-medium text-[#1A2B3D]">₦{minPrice.toLocaleString()}</span>
              </div>
              <div className="h-[1px] w-4 bg-slate-200" />
              <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-right">
                <span className="text-[9px] font-medium text-slate-400 uppercase block mb-0.5">Max</span>
                <span className="text-sm font-medium text-[#1A2B3D]">₦{maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="space-y-6">
          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest px-1">Vehicle Classification</label>
          <div className="grid grid-cols-2 gap-3">
            {['Sedan', 'SUV', 'Luxury', 'Van'].map((type) => (
              <label
                key={type}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-4 rounded-2xl border cursor-pointer transition-all active:scale-95 text-xs font-medium uppercase tracking-tight",
                  localFilters.bodyType === type
                    ? "bg-[#1A2B3D] text-white border-[#1A2B3D] shadow-lg shadow-black/10"
                    : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                )}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={localFilters.bodyType === type}
                  onChange={() => handleLocalChange('bodyType', localFilters.bodyType === type ? '' : type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Vehicle Brand */}
        <div className="space-y-6">
          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest px-1">Preferred Brands</label>
          <div className="space-y-1">
            {['Toyota', 'Mercedes', 'Lexus', 'Honda'].map((brand) => (
              <label key={brand} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn("h-5 w-5 rounded-md border-2 transition-all flex items-center justify-center", localFilters.brand === brand ? "bg-[#FDB813] border-[#FDB813]" : "bg-white border-slate-200 group-hover:border-slate-400")}>
                    {localFilters.brand === brand && <div className="h-2 w-2 rounded-full bg-[#1A2B3D]" />}
                  </div>
                  <span className="text-sm font-bold text-slate-600 group-hover:text-[#1A2B3D]">{brand}</span>
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={localFilters.brand === brand}
                  onChange={() => handleLocalChange('brand', localFilters.brand === brand ? '' : brand)}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div className="space-y-6">
          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest px-1">Drive System</label>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {['Auto', 'Manual'].map((t) => (
              <button
                key={t}
                onClick={() => handleLocalChange('transmission', t)}
                className={cn(
                  "flex-1 py-4 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all",
                  localFilters.transmission === t
                    ? "bg-white text-[#1A2B3D] shadow-md transform scale-[1.02]"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleApply}
            className="w-full bg-[#FDB813] hover:bg-[#EAA810] text-[#1A2B3D] rounded-[1.5rem] py-6 font-medium text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-yellow-500/10"
          >
            Apply Filters
          </Button>
          <button
            onClick={() => setLocalFilters({ ...filters, minPrice: '', maxPrice: '', brand: '', bodyType: '', transmission: '' })}
            className="w-full mt-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest hover:text-[#1A2B3D] transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
