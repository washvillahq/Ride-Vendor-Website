import React from 'react';
import { useAuth } from '../../features/auth/hooks';
import { useMyBookings } from '../../features/bookings/hooks';
import { useMyOrders } from '../../features/orders/hooks';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  Calendar,
  ShoppingBag,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Car
} from 'lucide-react';

const SummaryCard = ({ title, value, isLoading, icon, colorClass, gradientClass }) => (
  <div className={`relative overflow-hidden p-8 rounded-[2.5rem] border border-white/10 shadow-xl group transition-all duration-500 hover:scale-[1.02] ${gradientClass}`}>
    <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border border-white/10 ${colorClass}`}>
          {icon}
        </div>
        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={16} className="text-white" />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black leading-none uppercase tracking-[0.2em] text-white/50 mb-2">{title}</p>
        {isLoading ? (
          <Skeleton className="h-10 w-24 bg-white/5" />
        ) : (
          <p className="text-4xl font-black tracking-tighter text-white">{value}</p>
        )}
      </div>
    </div>
    {/* Decorative blur element */}
    <div className={`absolute top-[-20px] right-[-20px] h-32 w-32 rounded-full blur-[60px] opacity-20 pointer-events-none group-hover:scale-150 transition-transform duration-700 ${colorClass}`} />
  </div>
);

const DashboardHome = () => {
  const { user } = useAuth();
  const { data: bookingsData, isLoading: loadingBookings } = useMyBookings();
  const { data: ordersData, isLoading: loadingOrders } = useMyOrders();

  const bookings = bookingsData?.data?.bookings || [];
  const orders = ordersData?.data?.orders || [];

  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'active').length;

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#002E3E]">Active Account</span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Updated 2m ago</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
            Welcome back, <br />
            <span className="text-accent underline decoration-accent/20 underline-offset-8">{user?.name?.split(' ')[0]}!</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-lg pt-2 leading-relaxed">
            Everything looks great. You have {activeBookings} active rentals scheduled for this week.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border-slate-100"
          >
            Manage Profile
          </Button>
          <Button
            variant="accent"
            className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/20"
            onClick={() => window.location.href = '/car-hire'}
          >
            <Car size={14} className="mr-2" />
            Book Car
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SummaryCard
          title="Active Rentals"
          value={activeBookings}
          isLoading={loadingBookings}
          icon={<Calendar className="w-6 h-6 text-emerald-400" />}
          colorClass="bg-emerald-500/20"
          gradientClass="bg-[#002E3E]"
        />
        <SummaryCard
          title="Total Orders"
          value={orders.length}
          isLoading={loadingOrders}
          icon={<ShoppingBag className="w-6 h-6 text-blue-400" />}
          colorClass="bg-blue-500/20"
          gradientClass="bg-slate-900"
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
          <Link to="/dashboard/bookings" className="text-[10px] font-black uppercase tracking-widest text-[#002E3E] hover:text-accent transition-colors flex items-center gap-1 group">
            Full Report <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          {loadingBookings ? (
            <div className="p-8 space-y-6">
              {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
            </div>
          ) : bookings.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {bookings.slice(0, 6).map(booking => (
                <div key={booking._id} className="group p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-all duration-300">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-900 relative overflow-hidden group-hover:scale-110 transition-transform">
                      {booking.car?.images?.[0] ? <img src={booking.car.images[0]} alt="" className="object-cover w-full h-full" /> : <Car size={24} className="text-slate-300" />}
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-slate-900 leading-none">{booking.car?.title || 'Luxury Hire'}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {dayjs(booking.startDate).format('MMM D')} • {booking.totalDays} Days • ID: #{booking._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        booking.status === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                          'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                      {booking.status}
                    </div>
                    <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md transition-all">
                      <ArrowUpRight size={18} className="text-slate-400 hover:text-primary" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center space-y-4">
              <div className="h-20 w-20 mx-auto bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                <Calendar size={40} strokeWidth={1} />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No recent hires found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
