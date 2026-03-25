import React, { useState, useMemo } from 'react';
import { useMyBookings, useCancelBooking, useExtendBooking, useCarAvailabilitySchedule } from '../../features/bookings/hooks';
import ErrorState from '../../components/feedback/ErrorState';
import dayjs from 'dayjs';
import {
  Car,
  Calendar,
  Clock,
  ChevronRight,
  Download,
  XCircle,
  RotateCcw,
  Phone,
  Info,
  History,
  X,
  ShoppingBag,
  MapPin,
  CheckCircle,
  ThermometerSnowflake
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { toast } from 'react-hot-toast';

const ReturnInstructionsModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#002E3E]/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-[60vh] h-[60vh] max-w-[95vw] rounded-[2.5rem] shadow-2xl p-6 overflow-y-auto animate-in zoom-in-95 duration-300 custom-scrollbar">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-[#1A2B3D] transition-colors">
          <X size={20} />
        </button>

        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#1A2B3D] tracking-tight">Return Instructions</h2>
            <p className="text-xs text-slate-500 font-medium">Please follow these steps for a smooth drop-off.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
              <div className="h-8 w-8 bg-white shadow-sm rounded-xl flex items-center justify-center text-[#1A2B3D]">
                <Car size={16} />
              </div>
              <p className="font-bold text-xs text-[#1A2B3D]">Refill tank to Full.</p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
              <div className="h-8 w-8 bg-white shadow-sm rounded-xl flex items-center justify-center text-[#1A2B3D]">
                <ShoppingBag size={16} />
              </div>
              <p className="font-bold text-xs text-[#1A2B3D]">Check for personal items.</p>
            </div>
          </div>

          <div className="p-4 rounded-[1.5rem] bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#FDB813] rounded-lg flex items-center justify-center text-white">
                <MapPin size={16} />
              </div>
              <div>
                <h4 className="font-black text-[12px] text-[#1A2B3D]">Ilorin Hub (Main)</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Behind Royal Rock Hotel</p>
              </div>
            </div>
            <button className="text-[9px] font-black underline uppercase tracking-widest text-[#1A2B3D]">
              Open Maps
            </button>
          </div>

          <div className="p-6 rounded-[2rem] border-2 border-dashed border-slate-200 bg-white text-center space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Hub Access Code</p>
            <h3 className="text-3xl font-black text-[#1A2B3D] tracking-tighter">{booking?.hubAccessCode || 'RV-XXXX'}</h3>
            <p className="text-[9px] font-bold text-slate-500 max-w-[180px] mx-auto leading-relaxed">Show this to the Hub agent.</p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#002E3E] hover:bg-[#001D24] text-white font-black text-xs py-4 rounded-xl transition-all active:scale-95"
          >
            I'm at the Hub
          </button>
        </div>
      </div>
    </div>
  );
};

const ExtendRentalModal = ({ isOpen, onClose, booking, onConfirm }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const { mutateAsync: extendBooking, isLoading } = useExtendBooking();

  // Robust Car ID resolution (handles both populated and unpopulated car field)
  const carId = typeof booking?.car === 'object' ? booking.car?._id : booking?.car;
  const { data: availabilityData, isLoading: isLoadingAvailability } = useCarAvailabilitySchedule(carId);

  // Set of booked timestamps (start of day)
  // We access .data.bookedDates as per the standard response structure
  const bookedDatesSet = useMemo(() => {
    return new Set(
      availabilityData?.data?.bookedDates?.map(d => dayjs(d).startOf('day').unix()) || []
    );
  }, [availabilityData]);

  if (!isOpen || !booking) return null;

  const currentEndDate = dayjs(booking.endDate);
  const dailyRate = (typeof booking.car === 'object' ? booking.car?.pricePerDay : booking.totalPrice / booking.totalDays) || 0;
  const servicePricePerDay = booking.services?.reduce((acc, s) => acc + (s.pricePerDay || 0), 0) || 0;
  const fullDailyRate = dailyRate + servicePricePerDay;

  // Generate 14 days starting from day after current end date
  const availableExtensionDates = [...Array(14)].map((_, i) => currentEndDate.add(i + 1, 'day'));

  const toggleDate = (date) => {
    const timestamp = date.startOf('day').unix();
    if (bookedDatesSet.has(timestamp)) return; // Prevent selecting booked dates

    const dateStr = date.format('YYYY-MM-DD');
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr].sort());
    }
  };

  const handleExtend = async () => {
    if (selectedDates.length === 0) return toast.error('Please select extension dates');
    try {
      const response = await extendBooking({
        bookingId: booking._id,
        newDates: selectedDates
      });
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        onConfirm(); // Success modal fallback
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Extension failed');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#002E3E]/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-[70vh] h-[70vh] max-w-[100vw] rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto animate-in zoom-in-95 duration-300 custom-scrollbar">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-[#1A2B3D] transition-colors">
          <X size={20} />
        </button>

        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#1A2B3D] tracking-tight">Extend Your Rental</h2>
            <p className="text-xs text-slate-500 font-medium">Adjust your schedule easily.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="font-black text-sm text-[#1A2B3D]">{booking.car?.brand} {booking.car?.model}</h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Current End: {currentEndDate.format('MMM DD, YYYY')}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-[9px] font-black text-[#1A2B3D] uppercase tracking-widest">Additional Dates</p>
              {isLoadingAvailability && <span className="text-[8px] font-bold text-amber-500 animate-pulse uppercase">Syncing Blocks...</span>}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableExtensionDates.map(date => {
                const dateStr = date.format('YYYY-MM-DD');
                const isSelected = selectedDates.includes(dateStr);
                const isBooked = bookedDatesSet.has(date.startOf('day').unix());

                return (
                  <button
                    key={date.format()}
                    onClick={() => toggleDate(date)}
                    disabled={isBooked}
                    className={cn(
                      "w-10 h-10 rounded-full font-black text-[10px] transition-all border flex flex-col items-center justify-center relative",
                      isBooked
                        ? "bg-slate-50 border-slate-100 text-slate-200 cursor-not-allowed overflow-hidden line-through"
                        : isSelected
                          ? "bg-[#1A2B3D] border-[#1A2B3D] text-white shadow-lg shadow-black/10"
                          : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                    )}
                  >
                    {isBooked && <div className="absolute inset-0 bg-slate-200/50 backdrop-grayscale" />}
                    <span className={cn("text-[6px] uppercase opacity-60 leading-none z-10", isSelected ? "text-white/60" : "text-slate-400")}>{date.format('ddd')}</span>
                    <span className="z-10">{date.format('D')}</span>
                  </button>
                );
              })}
            </div>
            {bookedDatesSet.size > 0 && <p className="text-[8px] font-bold text-slate-400 italic mt-2">* Dates in gray are already reserved by others.</p>}
          </div>

          <div className="p-5 rounded-[1.5rem] bg-sky-50 space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-sky-900 opacity-60">
              <span>Daily Rate (incl. services)</span>
              <span>₦{fullDailyRate.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-sky-900">
              <span>Extension Period</span>
              <span>+{selectedDates.length} Days</span>
            </div>
            <div className="pt-2 border-t border-sky-200/50 flex justify-between items-center">
              <span className="font-black text-sky-950 uppercase text-[9px]">Total Amount to Pay</span>
              <span className="text-lg font-black text-sky-950">₦{(fullDailyRate * selectedDates.length).toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleExtend}
            disabled={isLoading || selectedDates.length === 0}
            className="w-full bg-[#FDB813] hover:bg-[#EAA810] text-[#1A2B3D] font-black text-xs py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-yellow-500/10"
          >
            {isLoading ? 'Processing...' : `Pay ₦${(fullDailyRate * selectedDates.length).toLocaleString()} to Extend`}
          </button>
        </div>
      </div>
    </div>
  );
};

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#002E3E]/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 overflow-hidden text-center animate-in zoom-in-95 duration-300">
        <div className="h-24 w-24 bg-[#FDB813]/10 text-[#FDB813] rounded-full flex items-center justify-center mx-auto mb-8 border-[6px] border-[#FDB813]/5">
          <div className="h-16 w-16 bg-[#FDB813] rounded-full flex items-center justify-center text-white shadow-lg shadow-yellow-500/30">
            <CheckCircle size={36} strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <h2 className="text-2xl font-black text-[#1A2B3D] tracking-tight leading-tight">Your rental is extended.</h2>
          <p className="text-sm font-medium text-slate-500 leading-relaxed px-4">
            Your new return code has been updated in your dashboard.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#002E3E] hover:bg-[#001D24] text-white font-black text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          Back to Dashboard <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const getRentalProgress = (booking) => {
  const now = dayjs();
  const start = dayjs(booking.startDate);
  const end = dayjs(booking.endDate);
  const total = end.diff(start, 'minute');
  const elapsed = now.diff(start, 'minute');
  if (elapsed < 0) return 0;
  if (elapsed >= total) return 100;
  return (elapsed / total) * 100;
};

const getTimeRemaining = (booking) => {
  const now = dayjs();
  const end = dayjs(booking.endDate);
  const diff = end.diff(now, 'hour');
  if (diff <= 0) return "Rental Ended";
  const days = Math.floor(diff / 24);
  const hours = diff % 24;
  if (days === 0) return `${hours} Hours Remaining`;
  return `${days} Days, ${hours} Hours Remaining`;
};

const MyBookings = () => {
  const { data, isLoading, isError, refetch } = useMyBookings();
  const { mutateAsync: cancelBooking } = useCancelBooking();
  const [activeTab, setActiveTab] = useState('All Rentals');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const bookings = data?.data?.bookings || [];
  const featuredBooking = bookings.find(b => b.status === 'active') || bookings.find(b => b.status === 'confirmed') || bookings[0];

  const filteredBookings = useMemo(() => {
    if (activeTab === 'All Rentals') return bookings;
    if (activeTab === 'Upcoming') return bookings.filter(b => b.status === 'confirmed');
    if (activeTab === 'Past') return bookings.filter(b => b.status === 'completed');
    if (activeTab === 'Cancelled') return bookings.filter(b => b.status === 'cancelled');
    return bookings;
  }, [bookings, activeTab]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel? This is only permitted 48h before start.')) {
      try {
        await cancelBooking(id);
        toast.success('Booking cancelled successfully');
        refetch(); // Re-fetch bookings to update UI
      } catch (err) {
        toast.error(err.response?.data?.message || 'Cancellation failed');
      }
    }
  };

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <ReturnInstructionsModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        booking={selectedBooking}
      />
      <ExtendRentalModal
        isOpen={showExtendModal}
        booking={selectedBooking}
        onClose={() => setShowExtendModal(false)}
        onConfirm={() => {
          setShowExtendModal(false);
          setShowSuccessModal(true);
          refetch(); // Re-fetch bookings to update UI
        }}
      />
      <SuccessModal isOpen={showSuccessModal} onClose={() => { setShowSuccessModal(false); refetch(); }} />

      <div>
        <h1 className="text-3xl font-black text-[#1A2B3D] tracking-tight">My Rentals</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your active vehicle deployments and history.</p>
      </div>

      {!isLoading && featuredBooking && (
        <div className="bg-white rounded-[2rem] border border-slate-50 shadow-sm p-8 mb-12 flex flex-col lg:flex-row gap-10 items-center">
          <div className="w-full lg:w-[320px] h-[240px] rounded-[2rem] overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-100">
            <img
              src={featuredBooking.car?.images?.[0]?.url || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=600'}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-6 w-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1">
                <span className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                  featuredBooking.status === 'active' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                )}>
                  {featuredBooking.status === 'active' ? 'In Progress' : 'Confirmed'}
                </span>
                <h2 className="text-3xl font-black text-[#1A2B3D] tracking-tight mt-2">
                  {featuredBooking.car?.year || '2020'} {featuredBooking.car?.brand || 'Toyota'} {featuredBooking.car?.model || 'Camry'}
                </h2>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-slate-400">Plate: <span className="text-[#1A2B3D]">{featuredBooking.car?.plateNumber || 'Pending'}</span></p>
                  {featuredBooking.car?.climateControl && (
                    <div className="flex items-center gap-1 text-[10px] font-black text-sky-600 uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-md">
                      <ThermometerSnowflake size={12} /> A/C
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                <p className="text-xl font-black text-[#1A2B3D] tracking-tight">{getTimeRemaining(featuredBooking)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#FDB813] transition-all duration-1000" style={{ width: `${getRentalProgress(featuredBooking)}%` }} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                disabled={true}
                className="flex-1 bg-slate-100 text-slate-400 font-black text-xs py-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
              >
                <History size={16} strokeWidth={3} />
                Extend Rental
                {/* (Disabled) */}
              </button>
              <button
                onClick={() => { setSelectedBooking(featuredBooking); setShowReturnModal(true); }}
                className="flex-1 bg-[#002E3E] hover:bg-[#001D24] text-white font-black text-xs py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Info size={16} />
                Return Instructions
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-slate-100 flex items-center gap-8 overflow-x-auto pb-1 scrollbar-hide">
        {['All Rentals', 'Upcoming', 'Past', 'Cancelled'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "text-xs font-medium uppercase tracking-widest pb-4 relative transition-all whitespace-nowrap",
              activeTab === tab ? "text-[#1A2B3D]" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FDB813] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Rental Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-40 bg-white rounded-[2.5rem] animate-pulse border border-slate-50" />)
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <div key={booking._id} className="bg-white p-5 rounded-[2.5rem] border border-slate-50 shadow-sm flex gap-6 items-center hover:shadow-md transition-all group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-900 border border-slate-100">
                <img src={booking.car?.images?.[0]?.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-[#1A2B3D] tracking-tight">{booking.car?.brand} {booking.car?.model}</h3>
                  <span className={cn("text-[8px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest",
                    booking.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                      booking.status === 'active' ? 'bg-amber-50 text-amber-600' :
                        booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  )}>
                    {booking.status === 'confirmed' ? 'Upcoming' : booking.status === 'active' ? 'In Progress' : booking.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400">
                  {dayjs(booking.startDate).format('MMM DD')} - {dayjs(booking.endDate).format('MMM DD')}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-[#1A2B3D]">₦{booking.totalPrice?.toLocaleString()}</p>
                  <p className="text-[9px] font-bold text-slate-400 flex items-center gap-1">Plate: <span className="text-slate-600">{booking.car?.plateNumber || 'N/A'}</span></p>
                </div>
                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={() => { setSelectedBooking(booking); setShowReturnModal(true); }}
                    className="text-[10px] font-black text-slate-400 hover:text-[#1A2B3D] flex items-center gap-1 transition-colors"
                  >
                    View Details <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 font-medium whitespace-nowrap">No rentals found in this category.</div>
        )}
      </div>

      <div className="bg-[#002E3E] rounded-[2.5rem] p-10 mt-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
        <div className="max-w-md relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight">Need help with your rental?</h2>
          <p className="text-slate-400 font-medium mt-3 leading-relaxed">Our 24/7 roadside assistance is one tap away.</p>
        </div>
        <button className="relative z-10 px-10 py-5 bg-white text-[#1A2B3D] font-black text-sm rounded-2xl flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/20">
          <Phone size={18} /> Call Support
        </button>
        <Car size={300} className="absolute right-[-100px] bottom-[-100px] text-white/5 rotate-[-20deg]" />
      </div>
    </div>
  );
};

export default MyBookings;
