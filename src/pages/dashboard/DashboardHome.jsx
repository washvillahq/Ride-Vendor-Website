import React from 'react';
import { useAuth } from '../../features/auth/hooks';
import { useMyBookings } from '../../features/bookings/hooks';
import { useMyOrders } from '../../features/orders/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { PageHeader } from '../../components/shared/Headers';
import StatusBadge from '../../components/ui/StatusBadge';
import Skeleton from '../../components/ui/Skeleton';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const SummaryCard = ({ title, value, isLoading, icon }) => (
  <Card>
    <CardContent className="p-6 flex items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border text-slate-900">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        {isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : <p className="text-3xl font-black">{value}</p>}
      </div>
    </CardContent>
  </Card>
);

const DashboardHome = () => {
  const { user } = useAuth();
  const { data: bookingsData, isLoading: loadingBookings } = useMyBookings();
  const { data: ordersData, isLoading: loadingOrders } = useMyOrders();

  const bookings = bookingsData?.data?.bookings || [];
  const orders = ordersData?.data?.orders || [];

  const activeBookings = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="space-y-8">
      <PageHeader 
        title={`Welcome back, ${user?.name?.split(' ')[0]}!`}
        description="Here's a quick look at your activity and account status."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Active Rentals" 
          value={activeBookings} 
          isLoading={loadingBookings}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <SummaryCard 
          title="Total Orders" 
          value={orders.length} 
          isLoading={loadingOrders}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <SummaryCard 
          title="Wallet Balance" 
          value="$0.00" 
          isLoading={false}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Link to="/dashboard/bookings" className="text-sm font-bold text-slate-500 hover:text-black hover:underline">View All</Link>
          </CardHeader>
          <CardContent>
            {loadingBookings ? (
               <div className="space-y-4">
                 {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
               </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.slice(0, 3).map(booking => (
                  <div key={booking._id} className="flex items-center justify-between p-4 rounded-xl border bg-slate-50">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-lg bg-white border flex items-center justify-center font-bold text-xs uppercase">
                          {booking.car?.brand?.charAt(0)}
                       </div>
                       <div>
                          <p className="text-sm font-bold">{booking.car?.name}</p>
                          <p className="text-xs text-slate-500">{dayjs(booking.startDate).format('MMM D')} - {dayjs(booking.endDate).format('MMM D, YYYY')}</p>
                       </div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-slate-400 font-medium italic">No recent bookings found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
           <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link to="/dashboard/orders" className="text-sm font-bold text-slate-500 hover:text-black hover:underline">View All</Link>
          </CardHeader>
          <CardContent>
             {loadingOrders ? (
               <div className="space-y-4">
                 {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
               </div>
            ) : orders.length > 0 ? (
               <div className="space-y-4">
                {orders.slice(0, 3).map(order => (
                  <div key={order._id} className="flex items-center justify-between p-4 rounded-xl border bg-slate-50">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-lg bg-white border flex items-center justify-center font-bold text-xs uppercase">
                          {order.car?.brand?.charAt(0)}
                       </div>
                       <div>
                          <p className="text-sm font-bold">{order.car?.name}</p>
                          <p className="text-xs text-slate-500">Order #{order._id.slice(-6)}</p>
                       </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-slate-400 font-medium italic">No recent orders found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
