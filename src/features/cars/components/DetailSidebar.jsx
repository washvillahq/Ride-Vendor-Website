import React from 'react';
import { MapPin, Calendar, MessageSquare, ChevronDown } from 'lucide-react';
import Button from '../../../components/ui/Button';

const DetailSidebar = ({ car }) => {
  if (!car) return null;

  const {
    pricePerDay,
    location,
  } = car;

  const formattedPrice = pricePerDay?.toLocaleString() || '120,000';

  return (
    <div className="space-y-8 sticky top-24">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-8">
        {/* Price Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-medium text-[#1A2B3D]">₦{formattedPrice}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">per day</p>
          </div>
          <div className="bg-[#FDB813]/10 px-3 py-1.5 rounded-full border border-[#FDB813]/20">
            <span className="text-[9px] font-medium text-[#B8860B] uppercase tracking-widest">Available Now</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Rental Period */}
          <div className="space-y-3">
            <label className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.2em] px-1">Rental Period</label>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 cursor-pointer hover:border-slate-300 transition-colors group">
              <Calendar className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              <span className="text-slate-400 text-xs font-bold">Select Dates</span>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="space-y-3">
            <label className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.2em] px-1">Pickup Location</label>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 cursor-pointer hover:border-slate-300 transition-colors group">
              <MapPin className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              <span className="text-slate-900 text-xs font-bold">{location || 'Ilorin Central'}</span>
              <ChevronDown className="w-4 h-4 text-slate-300 ml-auto" />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-6 pt-2">
          <Button className="w-full h-16 bg-[#FDB813] hover:bg-[#EAA810] text-[#1A2B3D] rounded-2xl font-medium text-xs uppercase tracking-widest shadow-lg shadow-yellow-500/20 active:scale-95 transition-all">
            Book This Ride
          </Button>

          <a 
            href="https://wa.me/2348144123316?text=Hello%20Ride%20Vendor,%20I%20want%20to%20book%20a%20car"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 text-primary hover:text-primary/70 transition-colors group"
          >
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="text-[11px] font-bold">Chat with a rental specialist</span>
          </a>
        </div>

        {/* Footer Text */}
        <p className="text-center text-[10px] text-slate-400 md:max-w-[240px] mx-auto font-medium leading-relaxed">
          Free cancellation up to 48 hours before pickup.
        </p>
      </div>
    </div>
  );
};

export default DetailSidebar;
