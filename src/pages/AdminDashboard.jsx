import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminStats } from '../features/admin/hooks';
import {
   Users,
   Car,
   ShoppingBag,
   ChevronRight,
   Clock,
   CheckCircle2,
   Package,
   ArrowUpRight
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/Table';
import { useAdminBookings, useAdminOrders } from '../features/admin/hooks';
import dayjs from 'dayjs';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/feedback/ErrorState';

const StatCard = ({ title, value, icon: Icon, color, bg, trend }) => (
   <div className="bg-white p-2 md:p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-32 h-32 ${bg}/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110`} />
      <div className="flex justify-between items-start relative z-10 mb-8">
         <div className={`h-14 w-14 ${bg} ${color} rounded-2xl flex items-center justify-center shadow-lg shadow-current/10`}>
            <Icon size={28} />
         </div>
         {trend && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
               +{trend}% <ArrowUpRight size={10} />
            </span>
         )}
      </div>
      <div className="relative z-10">
         <p className="text-xs font-medium text-slate-400 uppercase tracking-[0.2em] leading-none mb-3">{title}</p>
         <h3 className="text-lg md:text:3xl font-medium text-slate-900 tracking-tighter">{value}</h3>
      </div>
   </div>
);

const NairaIcon = ({ size = 28 }) => (
   <span style={{ fontSize: size, lineHeight: 1, fontWeight: 600 }}>₦</span>
);

const AdminDashboard = () => {
   const { data: statsData, isLoading: statsLoading, isError, refetch } = useAdminStats();
   const { data: bookingsData, isLoading: bookingsLoading } = useAdminBookings({ limit: 5 });
   const { data: ordersData, isLoading: ordersLoading } = useAdminOrders({ limit: 5 });

   const stats = statsData?.data || {};
   const recentBookings = bookingsData?.data?.bookings || bookingsData?.data?.data || [];
   const recentOrders = ordersData?.data?.orders || ordersData?.data?.data || [];

   if (isError) return <div className="container py-12"><ErrorState onRetry={refetch} /></div>;

   return (
      <div className="space-y-12 pb-20">
         {/* Header */}
         <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h1 className="text-4xl font-medium text-slate-900 tracking-tight">Executive Dashboard</h1>
               <p className="text-slate-500 mt-1 font-medium">Real-time oversight of RideVendor's global operations.</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                     <div key={i} className="h-10 w-10 rounded-full border-4 border-slate-50 bg-slate-200" />
                  ))}
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active System Admins</p>
            </div>
         </section>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsLoading ? (
               Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-[2.5rem]" />)
            ) : (
               <>
                  <StatCard
                     title="Total Users"
                     value={stats.totalUsers || 0}
                     icon={Users}
                     bg="bg-blue-600"
                     color="text-white"
                     trend="12"
                  />
                  <StatCard
                     title="Active Bookings"
                     value={stats.activeBookings || 0}
                     icon={Car}
                     bg="bg-emerald-500"
                     color="text-white"
                     trend="8"
                  />
                  <StatCard
                     title="Marketplace Sales"
                     value={stats.totalOrders || 0}
                     icon={ShoppingBag}
                     bg="bg-orange-500"
                     color="text-white"
                     trend="24"
                  />
                  <StatCard
                     title="Total Performance"
                     value={`₦${stats.totalRevenue?.toLocaleString() || 0}`}
                     icon={NairaIcon}
                     bg="bg-purple-600"
                     color="text-white"
                     trend="18"
                  />
               </>
            )}
         </div>

         {/* Main Content Areas */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Recent Bookings - 2 columns */}
            <div className="xl:col-span-2 space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                        <Clock size={20} />
                     </div>
                     <h2 className="text-2xl font-medium text-slate-900 tracking-tight">Recent Rental Bookings</h2>
                  </div>
                  <Link to="/admin/bookings" className="text-xs font-medium uppercase tracking-widest text-emerald-500 hover:text-emerald-600 transition-colors flex items-center gap-1">
                     View All <ChevronRight size={14} />
                  </Link>
               </div>

               <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <Table>
                     <TableHeader className="bg-slate-50/50">
                        <TableRow>
                           <TableHead className="py-5 font-medium uppercase tracking-widest text-[10px]">Client / Vehicle</TableHead>
                           <TableHead className="py-5 font-medium uppercase tracking-widest text-[10px]">Scheduled</TableHead>
                           <TableHead className="py-5 font-medium uppercase tracking-widest text-[10px]">Status</TableHead>
                           <TableHead className="py-5 font-medium uppercase tracking-widest text-[10px] text-right">Revenue</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {bookingsLoading ? (
                           Array(5).fill(0).map((_, i) => (
                              <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                           ))
                        ) : recentBookings.length > 0 ? recentBookings.map((booking) => (
                           <TableRow key={booking._id} className="group hover:bg-slate-50/50 transition-colors">
                              <TableCell className="py-5">
                                 <div>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{booking.car?.title || 'Vehicle'}</p>
                                 </div>
                              </TableCell>
                              <TableCell className="py-5 font-bold text-xs text-slate-500 uppercase tracking-tighter">
                                 {dayjs(booking.startDate).format('MMM D')} - {dayjs(booking.endDate).format('MMM D')}
                              </TableCell>
                              <TableCell className="py-5">
                                 <StatusBadge status={booking.status} className="text-[9px] uppercase font-medium px-3" />
                              </TableCell>
                              <TableCell className="py-5 text-right font-medium text-slate-900">
                                 ₦{booking.totalPrice?.toLocaleString()}
                              </TableCell>
                           </TableRow>
                        )) : (
                           <TableRow>
                              <TableCell colSpan={4} className="py-12 text-center text-slate-400 italic">No recent rental activity found.</TableCell>
                           </TableRow>
                        )}
                     </TableBody>
                  </Table>
               </div>
            </div>

            {/* Marketplace Activity - 1 column */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                        <Package size={20} />
                     </div>
                     <h2 className="text-2xl font-medium text-slate-900 tracking-tight">Recent Sales</h2>
                  </div>
                  <Link to="/admin/orders" className="text-xs font-medium uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1">
                     View All <ChevronRight size={14} />
                  </Link>
               </div>

               <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
                  {ordersLoading ? (
                     Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
                  ) : recentOrders.length > 0 ? recentOrders.map((order) => (
                     <div key={order._id} className="flex items-center justify-between p-4 rounded-3xl border border-slate-50 hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-medium overflow-hidden">
                              {order.car?.images?.[0] ? (
                                 <img src={order.car.images[0].url} className="h-full w-full object-cover opacity-80" alt="Car" />
                              ) : <ShoppingBag size={20} />}
                           </div>
                           <div>
                              <p className="text-sm font-medium text-slate-900 leading-none">{order.car?.title || 'Vehicle Order'}</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{order.user?.name || 'Customer'}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-medium text-slate-900">₦{order.totalPrice?.toLocaleString()}</p>
                           <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Confirmed</p>
                        </div>
                     </div>
                  )) : (
                     <div className="py-12 text-center text-slate-400 italic text-sm">No recent sales records.</div>
                  )}

                  <div className="pt-4 border-t border-slate-50">
                     <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                           <CheckCircle2 size={48} />
                        </div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 mb-2">System Status</p>
                        <h4 className="text-lg font-bold mb-4">Operational Status: Stable</h4>
                        <button className="px-4 py-2 bg-white text-black text-[10px] font-medium uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all">Review Audit Logs</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminDashboard;
