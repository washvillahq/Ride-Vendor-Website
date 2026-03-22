import React from 'react';
import { MapPin, Calendar, Sparkles, Search } from 'lucide-react';
import Button from '../../../components/ui/Button';

const RentalHero = () => {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
          Premium Car Hire for Every Occasion.
        </h1>
        <div className="h-1.5 w-20 bg-accent rounded-full" />
      </div>

      <div className="bg-primary p-4 md:p-6 rounded-[2rem] shadow-2xl shadow-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Pickup Point */}
          <div className="space-y-2 px-4 border-r border-white/10 last:border-none">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup Point</label>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-accent" />
              <select className="bg-transparent text-white text-sm font-bold outline-none w-full cursor-pointer appearance-none">
                <option className="text-slate-900">Ilorin Hub (Main)</option>
                <option className="text-slate-900">Airport Pickup</option>
                <option className="text-slate-900">Unity Road</option>
              </select>
            </div>
          </div>

          {/* Rental Period */}
          <div className="space-y-2 px-4 border-r border-white/10 last:border-none">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rental Period</label>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-accent" />
              <input 
                type="text" 
                placeholder="Start - End Date" 
                className="bg-transparent text-white text-sm font-bold outline-none w-full placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Service Category */}
          <div className="space-y-2 px-4 border-r border-white/10 last:border-none">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Category</label>
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <select className="bg-transparent text-white text-sm font-bold outline-none w-full cursor-pointer appearance-none">
                <option className="text-slate-900">Select Category</option>
                <option className="text-slate-900">Executive & VIP</option>
                <option className="text-slate-900">Wedding Specials</option>
                <option className="text-slate-900">Corporate</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="md:pl-4">
             <Button className="w-full bg-accent hover:bg-accent-light text-primary py-7 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-accent/20">
                Search Available Rides
                <Search className="w-4 h-4" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalHero;
