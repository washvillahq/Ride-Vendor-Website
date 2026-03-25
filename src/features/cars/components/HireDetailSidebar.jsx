import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, MessageSquare, ChevronDown, CheckCircle2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';

const HireDetailSidebar = ({ car, onBookNow }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [pickupLocation, setPickupLocation] = useState('Ilorin Central');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const datePickerRef = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!car) return null;

  const { pricePerDay } = car;
  const formattedPrice = pricePerDay?.toLocaleString() || '120,000';

  const dateLabel = selectedDates.length > 0
    ? `${dayjs(selectedDates[0]).format('MMM D')} - ${dayjs(selectedDates[selectedDates.length - 1]).format('MMM D')}`
    : 'Select Dates';

  const locations = ['Ilorin Central', 'Ilorin Airport', 'Challenge', 'Post Office', 'Tanker'];

  const handleBooking = () => {
    onBookNow({ selectedDates, pickupLocation });
  };

  return (
    <div className="space-y-8 sticky top-24">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-8 relative z-50">
        {/* Price Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-semibold text-[#1A2B3D]">₦{formattedPrice}</span>
            </div>
            <p className="text-base font-medium text-slate-400">per day</p>
          </div>
          <div className="bg-[#FDB813]/10 px-4 py-2 rounded-full border border-[#FDB813]/20">
            <span className="text-[10px] font-semibold text-[#B8860B] uppercase tracking-widest whitespace-nowrap">Available Now</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Rental Period */}
          <div className="space-y-3 relative" ref={datePickerRef}>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] px-1">Rental Period</label>
            <div
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 cursor-pointer hover:border-slate-300 transition-colors group"
            >
              <Calendar className="w-5 h-5 text-slate-400 group-hover:text-[#1A2B3D] transition-colors" />
              <span className="text-slate-400 text-sm font-medium truncate">{dateLabel}</span>
            </div>

            {isDatePickerOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-[9999]">
                <DayPicker
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={setSelectedDates}
                  disabled={{ before: new Date() }}
                  className="m-0"
                  modifiersStyles={{
                    selected: { backgroundColor: '#FDB813', color: '#1A2B3D', fontWeight: 'bold' }
                  }}
                />
                <div className="pt-4 border-t border-slate-50 flex justify-end">
                  <button
                    onClick={() => setIsDatePickerOpen(false)}
                    className="px-4 py-2 bg-[#1A2B3D] text-white rounded-xl text-[10px] font-medium uppercase tracking-widest"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pickup Location */}
          <div className="space-y-3 relative" ref={locationRef}>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] px-1">Pickup Location</label>
            <div
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 cursor-pointer hover:border-slate-300 transition-colors group"
            >
              <MapPin className="w-5 h-5 text-slate-400 group-hover:text-[#1A2B3D] transition-colors" />
              <span className="text-[#1A2B3D] text-sm font-medium truncate">{pickupLocation}</span>
              <ChevronDown className="w-4 h-4 text-slate-300 ml-auto" />
            </div>

            {isLocationOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[9999]">
                {locations.map((loc) => (
                  <div
                    key={loc}
                    onClick={() => {
                      setPickupLocation(loc);
                      setIsLocationOpen(false);
                    }}
                    className="px-6 py-4 hover:bg-slate-50 text-sm font-medium text-[#1A2B3D] cursor-pointer border-b border-slate-50 last:border-none flex items-center justify-between group"
                  >
                    {loc}
                    {pickupLocation === loc && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-6 pt-2">
          <Button
            onClick={handleBooking}
            className="w-full h-20 bg-[#FDB813] hover:bg-[#EAA810] text-[#1A2B3D] rounded-2xl font-semibold text-base uppercase tracking-widest shadow-xl shadow-yellow-500/20 active:scale-95 transition-all"
          >
            Book This Ride
          </Button>

          <button className="w-full flex items-center justify-center gap-3 text-[#1A2B3D] hover:text-primary transition-colors group">
            <MessageSquare className="w-6 h-6 text-[#1A2B3D]" />
            <span className="text-sm font-medium border-b-2 border-transparent group-hover:border-primary transition-all">Chat with a rental specialist</span>
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-center text-[11px] text-slate-400 md:max-w-xs mx-auto font-medium leading-relaxed opacity-80">
          Free cancellation up to 48 hours before pickup.
        </p>
      </div>
    </div>
  );
};

export default HireDetailSidebar;
