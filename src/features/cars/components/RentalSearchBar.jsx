import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar as CalendarIcon, Sparkles, Search, ChevronDown } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const RentalSearchBar = ({ onSearch }) => {
  const [pickupOpen, setPickupOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const [pickup, setPickup] = useState('Ilorin Hub (Main)');
  const [category, setCategory] = useState('Select Category');
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });

  const pickupRef = useRef(null);
  const categoryRef = useRef(null);
  const dateRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target)) setPickupOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(event.target)) setCategoryOpen(false);
      if (dateRef.current && !dateRef.current.contains(event.target)) setDateOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pickupOptions = ['Ilorin Hub (Main)', 'Airport Pickup', 'Unity Road', 'Challenge Area'];
  const categoryOptions = ['Executive & VIP', 'Wedding Specials', 'Corporate', 'Economy'];

  const formatDateRange = () => {
    if (!dateRange.from) return 'Start - End Date';
    if (!dateRange.to) return dayjs(dateRange.from).format('MMM D, YYYY');
    return `${dayjs(dateRange.from).format('MMM D')} - ${dayjs(dateRange.to).format('MMM D, YYYY')}`;
  };

  return (
    <div className="bg-[#1A2B3D] p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-primary/20 relative z-50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">

        {/* Pickup Point */}
        <div className="space-y-3 relative" ref={pickupRef}>
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] px-1">Pickup Point</label>
          <div
            onClick={() => setPickupOpen(!pickupOpen)}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 cursor-pointer hover:border-accent/50 transition-colors group"
          >
            <MapPin className="w-5 h-5 text-[#FDB813]" />
            <div className="flex-1">
              <span className="text-white text-sm font-semibold truncate block">{pickup}</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-white/30 transition-transform", pickupOpen && "rotate-180")} />
          </div>

          {pickupOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] py-2 animate-in fade-in zoom-in-95 duration-200">
              {pickupOptions.map(option => (
                <button
                  key={option}
                  onClick={() => { setPickup(option); setPickupOpen(false); }}
                  className={cn("w-full text-left px-5 py-3 text-sm font-medium hover:bg-slate-50 transition-colors", pickup === option ? "text-[#1A2B3D] bg-accent/5" : "text-slate-600")}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rental Period */}
        <div className="space-y-3 relative" ref={dateRef}>
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] px-1">Rental Period</label>
          <div
            onClick={() => setDateOpen(!dateOpen)}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 cursor-pointer hover:border-accent/50 transition-colors group"
          >
            <CalendarIcon className="w-5 h-5 text-[#FDB813]" />
            <div className="flex-1">
              <span className={cn("text-sm font-semibold block", dateRange.from ? "text-white" : "text-white/20")}>
                {formatDateRange()}
              </span>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-white/30 transition-transform", dateOpen && "rotate-180")} />
          </div>

          {dateOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-[100] animate-in fade-in zoom-in-95 duration-200">
              <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                className="rounded-2xl border-none shadow-none m-0"
                modifiersStyles={{
                  selected: { backgroundColor: '#FDB813', color: '#1A2B3D', fontWeight: 'bold' },
                  today: { color: '#FDB813', borderBottom: '2px solid' }
                }}
                disabled={{ before: new Date() }}
              />
              <div className="pt-4 mt-4 border-t border-slate-50 flex justify-end">
                <button
                  onClick={() => setDateOpen(false)}
                  className="bg-[#1A2B3D] text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Confirm Dates
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Service Category */}
        <div className="space-y-3 relative" ref={categoryRef}>
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] px-1">Service Category</label>
          <div
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 cursor-pointer hover:border-accent/50 transition-colors group"
          >
            <Sparkles className="w-5 h-5 text-[#FDB813]" />
            <div className="flex-1">
              <span className={cn("text-sm font-semibold truncate block text-white", category === 'Select Category' && "text-white/20")}>{category}</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-white/30 transition-transform", categoryOpen && "rotate-180")} />
          </div>

          {categoryOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] py-2 animate-in fade-in zoom-in-95 duration-200">
              {categoryOptions.map(option => (
                <button
                  key={option}
                  onClick={() => { setCategory(option); setCategoryOpen(false); }}
                  className={cn("w-full text-left px-5 py-3 text-sm font-medium hover:bg-slate-50 transition-colors", category === option ? "text-[#1A2B3D] bg-accent/5" : "text-slate-600")}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="h-[60px]">
          <Button
            onClick={() => onSearch?.({ pickup, category, dateRange })}
            className="w-full h-full bg-[#FDB813] hover:bg-[#EAA810] text-[#1A2B3D] rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-yellow-500/10"
          >
            Search Available Rides
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RentalSearchBar;
