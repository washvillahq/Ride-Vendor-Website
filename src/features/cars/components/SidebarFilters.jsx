import React, { useState, useEffect } from 'react';
import { Settings2, X, Check } from 'lucide-react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';

const SidebarFilters = ({ filters, onFilterChange, onApply, maxPriceLimit, minPriceLimit }) => {
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

  const maxLimit = maxPriceLimit || 1000000;
  const minLimit = minPriceLimit || 0;
  const isSale = maxLimit > 1000000;

  const minPrice = parseInt(localFilters.minPrice) || minLimit;
  const maxPrice = parseInt(localFilters.maxPrice) || maxLimit;
  const step = isSale ? 100000 : 5000;

  return (
    <div className="bg-white lg:py-4 space-y-8 lg:sticky lg:top-24">
      {/* Mobile Toggle Header */}
      <div className="flex items-center justify-between lg:block px-1">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-slate-800" strokeWidth={1.5} />
          <h3 className="font-bold text-xl text-slate-900 tracking-tight">Filters</h3>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden h-10 w-10 flex items-center justify-center bg-accent text-[#1A2B3D] rounded-xl active:scale-90 transition-all font-bold"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Settings2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Filters Content */}
      <div className={cn(
        "space-y-10 lg:block transition-all duration-500 overflow-hidden lg:max-h-none",
        isMobileOpen ? "max-h-[2000px] opacity-100 mt-8 px-1" : "max-h-0 opacity-0 lg:opacity-100 lg:mt-0 lg:px-1"
      )}>
        {/* Price Range */}
        <div className="space-y-6 pb-8 border-b border-slate-100">
          <label className="text-base font-medium text-slate-900">
            {isSale ? 'Price Range' : 'Price Range (Daily)'}
          </label>
          <div className="space-y-6 relative px-1 pt-2">
            <div className="absolute h-[3px] w-full bg-slate-100 rounded-full top-[14px]">
              <div
                className="absolute h-full bg-accent rounded-full"
                style={{
                  left: `${((minPrice - minLimit) / (maxLimit - minLimit)) * 100}%`,
                  right: `${100 - ((maxPrice - minLimit) / (maxLimit - minLimit)) * 100}%`
                }}
              />
            </div>

            <input
              type="range"
              min={minLimit}
              max={maxLimit}
              step={step}
              value={minPrice}
              onChange={(e) => {
                const val = Math.min(parseInt(e.target.value), maxPrice - (isSale ? 500000 : 10000));
                handleLocalChange('minPrice', val);
              }}
              className="absolute top-[6px] left-0 w-full bg-transparent appearance-none pointer-events-none z-20 cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:appearance-none transition-transform hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-125"
            />
            <input
              type="range"
              min={minLimit}
              max={maxLimit}
              step={step}
              value={maxPrice}
              onChange={(e) => {
                const val = Math.max(parseInt(e.target.value), minPrice + (isSale ? 500000 : 10000));
                handleLocalChange('maxPrice', val);
              }}
              className="absolute top-[6px] left-0 w-full bg-transparent appearance-none pointer-events-none z-20 cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:appearance-none transition-transform hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-125"
            />

            <div className="flex items-center justify-between pt-4">
              <span className="text-sm font-bold text-slate-600 tracking-tight">₦{minPrice.toLocaleString()}</span>
              <span className="text-sm font-bold text-slate-600 tracking-tight">₦{maxPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="space-y-5 pb-8 border-b border-slate-100">
          <label className="text-base font-medium text-slate-900">Vehicle Type</label>
          <div className="space-y-3">
            {['Sedan', 'SUV', 'Luxury', 'Van'].map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="appearance-none h-6 w-6 border-2 border-slate-200 rounded-md checked:bg-accent checked:border-accent transition-all cursor-pointer group-hover:border-slate-300"
                    checked={localFilters.bodyType === type}
                    onChange={() => handleLocalChange('bodyType', localFilters.bodyType === type ? '' : type)}
                  />
                  {localFilters.bodyType === type && (
                    <Check className="absolute w-4 h-4 text-white pointer-events-none" strokeWidth={3} />
                  )}
                </div>
                <span className={cn("text-lg font-medium transition-colors", localFilters.bodyType === type ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700")}>
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Vehicle Brand */}
        <div className="space-y-5 pb-8 border-b border-slate-100">
          <label className="text-base font-medium text-slate-900">Preferred Brands</label>
          <div className="space-y-3">
            {['Toyota', 'Mercedes', 'Lexus', 'Honda'].map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="appearance-none h-6 w-6 border-2 border-slate-200 rounded-md checked:bg-accent checked:border-accent transition-all cursor-pointer group-hover:border-slate-300"
                    checked={localFilters.brand === brand}
                    onChange={() => handleLocalChange('brand', localFilters.brand === brand ? '' : brand)}
                  />
                  {localFilters.brand === brand && (
                    <Check className="absolute w-4 h-4 text-white pointer-events-none" strokeWidth={3} />
                  )}
                </div>
                <span className={cn("text-lg font-medium transition-colors", localFilters.brand === brand ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700")}>
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div className="space-y-4">
          <label className="text-base font-medium text-slate-900">Transmission</label>
          <div className="flex gap-3">
            {['Auto', 'Manual'].map((t) => (
              <button
                key={t}
                onClick={() => handleLocalChange('transmission', t)}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border-2",
                  localFilters.transmission === t
                    ? "bg-[#1A2B3D] text-white border-[#1A2B3D]"
                    : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 space-y-4">
          <Button
            onClick={handleApply}
            className="w-full bg-accent hover:bg-yellow-500 text-[#1A2B3D] rounded-2xl py-4 font-semibold text-sm uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-yellow-500/10"
          >
            Apply Filters
          </Button>
          <button
            onClick={() => {
              const resetValues = { ...filters, minPrice: '', maxPrice: '', brand: '', bodyType: '', transmission: '' };
              setLocalFilters(resetValues);
              onFilterChange(resetValues);
            }}
            className="w-full text-xs font-semibold text-slate-400 uppercase tracking-widest hover:text-[#1A2B3D] transition-colors py-2"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
