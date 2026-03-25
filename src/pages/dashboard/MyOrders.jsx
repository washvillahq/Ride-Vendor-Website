import React from 'react';
import { useMyOrders } from '../../features/orders/hooks';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import dayjs from 'dayjs';
import {
  ShoppingBag,
  Car,
  ArrowUpRight,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Loader2
} from 'lucide-react';
import { useReInitializePayment } from '../../features/payments/hooks';
import { toast } from 'react-hot-toast';

const MyOrders = () => {
  const { data, isLoading, isError, refetch } = useMyOrders();
  const orders = data?.data?.orders || [];
  const { mutate: reInitializePayment, isLoading: isInitializing } = useReInitializePayment();

  const handlePayment = (orderId) => {
    reInitializePayment(
      { type: 'order', relatedId: orderId },
      {
        onSuccess: (response) => {
          if (response?.data?.authorization_url) {
            window.location.href = response.data.authorization_url;
          } else {
            toast.error('Could not get payment URL. Please try again.');
          }
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Payment initialization failed');
        },
      }
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-primary tracking-tighter">Purchase History</h1>
          <p className="text-gray-medium font-medium tracking-tight">You have successfully initiated {orders.length} vehicle acquisitions.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl">
           <ShieldCheck size={16} className="text-emerald-500" />
           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Secure Transactions</span>
        </div>
      </div>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : orders.length > 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {orders.map((order) => (
              <div key={order._id} className="group p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 hover:bg-gray-50 transition-all duration-300">
                <div className="flex items-center gap-6">
                  {order.car?.images?.[0]?.url ? (
                    <div className="h-20 w-20 rounded-3xl overflow-hidden shadow-xl group-hover:rotate-3 transition-transform">
                      <img src={order.car.images[0].url} alt={order.car.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-20 w-20 rounded-3xl bg-primary flex items-center justify-center text-accent shadow-xl group-hover:rotate-6 transition-transform">
                      <Car size={32} strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-black text-primary tracking-tight">{order.car?.name || order.car?.title || 'Luxury Vehicle'}</p>
                      <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        order.paymentStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {order.paymentStatus}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                          <p className="text-[10px] font-black text-gray-medium uppercase tracking-widest leading-none">Order ID</p>
                          <p className="text-xs font-bold text-primary">#{order._id.slice(-10).toUpperCase()}</p>
                       </div>
                       <div className="h-4 w-[1px] bg-gray-200" />
                       <div className="flex items-center gap-2">
                          <p className="text-[10px] font-black text-gray-medium uppercase tracking-widest leading-none">Date</p>
                          <p className="text-xs font-bold text-primary">{dayjs(order.createdAt).format('MMMM D, YYYY')}</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 w-full lg:w-auto">
                  <div className="text-left lg:text-right flex-1 lg:flex-none">
                    <p className="text-3xl font-black text-primary">₦{order.price?.toLocaleString() || order.totalPrice?.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-gray-medium uppercase tracking-widest mt-1">Acquisition Price</p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {order.paymentStatus === 'pending' && order.status !== 'cancelled' ? (
                      <button 
                        onClick={() => handlePayment(order._id)}
                        disabled={isInitializing}
                        className="flex-1 sm:flex-none h-14 px-8 rounded-2xl bg-accent text-primary text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 hover:text-white transition-all shadow-lg shadow-accent/20"
                      >
                         {isInitializing ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                         Complete Payment
                      </button>
                    ) : (
                      <button className="flex-1 sm:flex-none h-14 px-8 rounded-2xl bg-white border border-gray-200 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
                         <Download size={16} />
                         Receipt
                      </button>
                    )}
                    <button className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-medium hover:bg-accent hover:text-primary transition-all group/link">
                       <ExternalLink size={18} className="group-hover/link:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !isLoading ? (
        <EmptyState
          title="No orders found"
          description="You haven't made any car purchases yet. Check out our 'For Sale' collection!"
          action={{
            label: "Explore For Sale",
            onClick: () => window.location.href = '/car-sales'
          }}
        />
      ) : (
        <div className="space-y-6">
           {Array(3).fill(0).map((_, i) => (
             <div key={i} className="h-32 bg-gray-100 rounded-[2.5rem] animate-pulse" />
           ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
