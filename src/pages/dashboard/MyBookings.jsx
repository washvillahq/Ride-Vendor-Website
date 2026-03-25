import React from 'react';
import { useMyBookings } from '../../features/bookings/hooks';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import dayjs from 'dayjs';
import { 
  Car, 
  Calendar, 
  MapPin, 
  Clock, 
  MoreVertical, 
  FileText, 
  MessageCircle,
  ArrowRight,
  CreditCard
} from 'lucide-react';
import { useReInitializePayment } from '../../features/payments/hooks';
import { toast } from 'react-hot-toast';

const BookingCard = ({ booking }) => {
  const { mutate: reInitializePayment, isLoading: isReInitializing } = useReInitializePayment();

  const handlePayment = () => {
    reInitializePayment(
      { type: 'booking', relatedId: booking._id },
      {
        onSuccess: (response) => {
          if (response?.data?.authorization_url) {
            window.location.href = response.data.authorization_url;
          } else {
            toast.error('Failed to get payment URL');
          }
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to initialize payment');
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
      <div className="relative h-56 overflow-hidden">
        {booking.car?.images?.[0]?.url ? (
          <img src={booking.car.images[0].url} alt={booking.car.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Car size={48} className="text-gray-medium" />
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className={`px-4 py-1.5 rounded-full backdrop-blur-md border text-[9px] font-black uppercase tracking-widest ${
            booking.status === 'confirmed' ? 'bg-emerald-500/80 border-emerald-400/30 text-white' :
            booking.status === 'active' ? 'bg-blue-500/80 border-blue-400/30 text-white' :
            'bg-primary/80 border-white/20 text-white'
          }`}>
            {booking.status}
          </div>
          {booking.paymentStatus === 'pending' && (
            <div className="px-4 py-1.5 rounded-full backdrop-blur-md border bg-accent/80 border-accent/30 text-primary text-[9px] font-black uppercase tracking-widest">
              Unpaid
            </div>
          )}
        </div>
        <button className="absolute top-4 right-4 h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all">
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black text-primary tracking-tight">{booking.car?.title || 'Luxury Vehicle'}</h3>
            <p className="text-[10px] font-bold text-gray-medium uppercase tracking-[0.2em] mt-1">{booking.car?.brand || 'Premium Hire'}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">₦{booking.totalPrice?.toLocaleString()}</p>
            <p className="text-[9px] font-black text-gray-medium uppercase tracking-widest">Total Price</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
             <div className="text-gray-medium"><Calendar size={16} /></div>
             <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-medium">Pick-up</p>
                <p className="text-[11px] font-bold text-primary">{dayjs(booking.startDate).format('MMM D, YYYY')}</p>
             </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
             <div className="text-gray-medium"><Clock size={16} /></div>
             <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-medium">Duration</p>
                <p className="text-[11px] font-bold text-primary">{booking.totalDays} Rental Days</p>
             </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-3">
           <div className="flex items-center gap-3">
              <button className="flex-1 h-12 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent hover:text-primary transition-all group/btn">
                 View Details <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <button className="h-12 w-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-medium hover:text-primary hover:border-primary transition-all">
                 <FileText size={18} />
              </button>
           </div>
           
           {booking.paymentStatus === 'pending' && booking.status !== 'cancelled' && (
             <button 
               onClick={handlePayment}
               disabled={isReInitializing}
               className="w-full h-12 rounded-xl bg-accent text-primary text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent/90 transition-all shadow-md active:scale-95 disabled:opacity-50"
             >
               {isReInitializing ? (
                 <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
               ) : (
                 <>
                   <CreditCard size={14} />
                   Complete Payment
                 </>
               )}
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

const MyBookings = () => {
  const { data, isLoading, isError, refetch } = useMyBookings();
  const [view, setView] = React.useState('active'); // 'active' | 'history'

  const allBookings = data?.data?.bookings || [];

  // Filter bookings: active if endDate is today or in the future
  const displayedBookings = React.useMemo(() => {
    const now = dayjs().startOf('day');
    return allBookings.filter((booking) => {
      const isPast = dayjs(booking.endDate).isBefore(now);
      return view === 'active' ? !isPast : isPast;
    });
  }, [allBookings, view]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-primary tracking-tighter">My Bookings</h1>
          <p className="text-gray-medium font-medium tracking-tight">You have {allBookings.length} total bookings in your account.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-2xl">
           <button 
             onClick={() => setView('active')}
             className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'active' ? 'bg-white shadow-sm text-primary' : 'text-gray-medium'}`}
           >
             Active
           </button>
           <button 
             onClick={() => setView('history')}
             className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'history' ? 'bg-white shadow-sm text-primary' : 'text-gray-medium'}`}
           >
             History
           </button>
        </div>
      </div>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : displayedBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedBookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      ) : !isLoading ? (
        <EmptyState 
          title={`No ${view} bookings yet`} 
          description={view === 'active' ? "You don't have any active rentals. Explore our catalog to find your next ride!" : "You don't have any past rentals."}
          action={{
            label: "Explore Cars",
            onClick: () => window.location.href = '/car-hire'
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {Array(4).fill(0).map((_, i) => (
             <div key={i} className="h-[450px] bg-gray-100 rounded-[2rem] animate-pulse" />
           ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
