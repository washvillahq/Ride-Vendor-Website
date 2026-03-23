import React, { useState } from 'react';
import { 
  Car, 
  Search, 
  MapPin, 
  DollarSign, 
  Settings2, 
  Palette,
  Truck,
  Box,
  LayoutGrid,
  Filter,
  X,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';
import { CAR_CONDITIONS, CAR_TYPES, SERVICE_CATEGORIES } from '../constants';

const SidebarFilters = ({ filters, onFilterChange, onApply }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const bodyTypes = [
    { label: 'Sedan', icon: Box, value: 'Sedan' },
    { label: 'SUV', icon: Box, value: 'SUV' },
    { label: 'Truck', icon: Truck, value: 'Truck' },
    { label: 'Coupe', icon: Box, value: 'Coupe' },
  ];

  const colors = [
    { name: 'Black', hex: 'bg-black' },
    { name: 'White', hex: 'bg-white border-slate-200' },
    { name: 'Grey', hex: 'bg-slate-200' },
    { name: 'Blue', hex: 'bg-blue-600' },
    { name: 'Red', hex: 'bg-red-600' },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 space-y-10 lg:sticky lg:top-24 shadow-sm">
      {/* Mobile Toggle Header */}
      <div className="flex items-center justify-between lg:block space-y-1">
        <div>
          <h3 className="font-black text-xl text-slate-900">Inventory Filters</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Curated Selection</p>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden h-10 w-10 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 text-primary active:scale-90 transition-all font-black"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
        </button>
      </div>

      {/* Filters Content */}
      <div className={cn(
        "space-y-10 lg:block transition-all duration-300 overflow-hidden lg:max-h-none",
        isMobileOpen ? "max-h-[2000px] opacity-100 mt-8" : "max-h-0 opacity-0 lg:opacity-100 lg:mt-0"
      )}>
        {/* Condition */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Condition</label>
          <div className="flex flex-wrap gap-2">
            {CAR_CONDITIONS.map((c) => (
              <button
                key={c}
                onClick={() => onFilterChange('condition', filters.condition === c ? '' : c)}
                className={cn(
                  "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                  filters.condition === c 
                    ? "bg-accent border-accent text-primary" 
                    : "bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-200"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Vehicle Brand</label>
          <div className="relative">
            <select 
              value={filters.brand || ''}
              onChange={(e) => onFilterChange('brand', e.target.value)}
              className="w-full bg-slate-50 border-slate-50 rounded-xl px-4 py-3.5 text-xs font-black text-slate-600 focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer"
            >
              <option value="">All Brands</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Mercedes">Mercedes</option>
              <option value="BMW">BMW</option>
              <option value="Lexus">Lexus</option>
              <option value="Tesla">Tesla</option>
              <option value="Ford">Ford</option>
              <option value="Nissan">Nissan</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Price Range (₦)</label>
          <div className="grid grid-cols-2 gap-3 items-center">
            <input 
              type="number" 
              placeholder="Min" 
              className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3.5 text-xs font-black text-slate-600 focus:ring-2 focus:ring-accent outline-none placeholder:text-slate-300"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
            />
            <input 
              type="number" 
              placeholder="Max" 
              className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3.5 text-xs font-black text-slate-600 focus:ring-2 focus:ring-accent outline-none placeholder:text-slate-300"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            />
          </div>
        </div>

        {/* Body Type */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Body Type</label>
          <div className="grid grid-cols-2 gap-3">
            {bodyTypes.map((type) => (
              <button
                key={type.label}
                onClick={() => onFilterChange('bodyType', filters.bodyType === type.value ? '' : type.value)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border transition-all",
                  filters.bodyType === type.value 
                    ? "bg-accent border-accent text-primary" 
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                )}
              >
                <type.icon className={cn("w-4 h-4", filters.bodyType === type.value ? "text-primary" : "text-slate-300")} />
                <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Service Category */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Service Category</label>
          <div className="relative">
            <select 
              value={filters.serviceCategory || ''}
              onChange={(e) => onFilterChange('serviceCategory', e.target.value)}
              className="w-full bg-slate-50 border-slate-50 rounded-xl px-4 py-3.5 text-xs font-black text-slate-600 focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer"
            >
              <option value="">Select Category</option>
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Transmission */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Transmission</label>
          <div className="flex gap-2">
            {['Auto', 'Manual'].map((t) => (
              <button
                key={t}
                onClick={() => onFilterChange('transmission', filters.transmission === t ? '' : t)}
                className={cn(
                  "flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                  filters.transmission === t 
                    ? "bg-accent border-accent text-primary" 
                    : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Fuel Type */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Fuel Type</label>
          <div className="flex flex-wrap gap-2">
            {['Petrol', 'Diesel', 'Hybrid', 'Electric'].map((f) => (
              <button
                key={f}
                onClick={() => onFilterChange('fuelType', filters.fuelType === f ? '' : f)}
                className={cn(
                  "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                  filters.fuelType === f 
                    ? "bg-accent border-accent text-primary" 
                    : "bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-200"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Year Range */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Year Range</label>
          <div className="grid grid-cols-2 gap-3 items-center">
            <input 
              type="number" 
              placeholder="Min Year" 
              className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3.5 text-xs font-black text-slate-600 focus:ring-2 focus:ring-accent outline-none placeholder:text-slate-300"
              value={filters.minYear || ''}
              onChange={(e) => onFilterChange('minYear', e.target.value)}
            />
            <input 
              type="number" 
              placeholder="Max Year" 
              className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3.5 text-xs font-black text-slate-600 focus:ring-2 focus:ring-accent outline-none placeholder:text-slate-300"
              value={filters.maxYear || ''}
              onChange={(e) => onFilterChange('maxYear', e.target.value)}
            />
          </div>
        </div>

        {/* Mileage (for sales) */}
        {onFilterChange && (
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Mileage Range (km)</label>
            <div className="grid grid-cols-2 gap-3 items-center">
              <input 
                type="number" 
                placeholder="Min" 
                className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3.5 text-xs font-black text-slate-600 focus:ring-2 focus:ring-accent outline-none placeholder:text-slate-300"
                value={filters.minMileage || ''}
                onChange={(e) => onFilterChange('minMileage', e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Max" 
                className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3.5 text-xs font-black text-slate-600 focus:ring-2 focus:ring-accent outline-none placeholder:text-slate-300"
                value={filters.maxMileage || ''}
                onChange={(e) => onFilterChange('maxMileage', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Seating Capacity */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Min Seats</label>
          <div className="flex gap-2">
            {[2, 4, 5, 7, 8].map((s) => (
              <button
                key={s}
                onClick={() => onFilterChange('minSeats', filters.minSeats === s ? '' : s)}
                className={cn(
                  "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                  filters.minSeats === s 
                    ? "bg-accent border-accent text-primary" 
                    : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                )}
              >
                {s}+
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Color Palette</label>
          <div className="flex flex-wrap gap-4 pt-1">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => onFilterChange('color', filters.color === color.name ? '' : color.name)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all shadow-sm ring-offset-2",
                  color.hex,
                  filters.color === color.name 
                    ? "ring-2 ring-accent border-white scale-110" 
                    : "border-slate-100 opacity-60 hover:opacity-100"
                )}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button 
            onClick={() => {
              onApply();
              setIsMobileOpen(false);
            }}
            className="w-full bg-primary hover:bg-slate-900 text-white rounded-2xl py-7 font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
