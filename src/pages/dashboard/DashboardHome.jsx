import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Calendar,
  CheckCircle2,
  MessageSquare,
  Car,
  ShoppingBag,
  Package,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '../../utils/cn';

const DashboardHome = () => {
  const { user } = useAuthStore();

  const serviceCards = [
    {
      title: 'Book a Car',
      description: 'Fast bookings. Reliable services',
      icon: Car,
      buttonText: 'Book Now',
      isAccent: true,
      link: '/car-hire'
    },
    {
      title: 'Car Purchase',
      description: 'Quality Tokunbo and Nigerian-used Cars',
      icon: ShoppingBag,
      buttonText: 'Browse Vehicles',
      isAccent: false,
      link: '/car-sales'
    },
    {
      title: 'Car Accessories',
      description: 'Get Genuine Parts & Accessories',
      icon: Package,
      buttonText: 'Explore (Coming Soon)',
      isAccent: false,
      link: null
    }
  ];

  const vehicleListings = [];
  const activities = [];

  const navigate = useNavigate();

  return (
    <div className="space-y-10 pb-12">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-medium text-[#1A2B3D] tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Paul'}!</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your vehicles, rentals, and services in Ilorin.</p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serviceCards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-start gap-4 h-full">
            <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center">
              <card.icon className="text-[#1A2B3D]" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-medium text-[#1A2B3D] tracking-tight">{card.title}</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">{card.description}</p>
            </div>
            <button 
              onClick={() => card.link && navigate(card.link)}
              disabled={!card.link}
              className={cn(
              "mt-auto px-8 py-3 rounded-xl font-medium text-xs transition-all active:scale-95",
              card.isAccent
                ? "bg-[#FDB813] text-[#1A2B3D] hover:bg-[#EAA810]"
                : "bg-[#002E3E] text-white hover:bg-[#001D24]"
            )}>
              {card.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Promo Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-[#FDB813] rounded-[2rem] p-8 flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-2xl font-medium text-[#1A2B3D]">List a Vehicle</h2>
            <p className="text-[#1A2B3D]/70 font-bold mt-1">Ready to sell? Get the best market value today.</p>
          </div>
          <button className="relative z-10 h-14 w-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-xl">
            <Plus size={32} strokeWidth={3} />
          </button>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 flex items-center justify-between group overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-medium text-[#1A2B3D]">Need a wash?</h2>
            <p className="text-slate-500 font-bold mt-1">Get 10% off at Wash Villa on your next wash</p>
          </div>
          <div className="relative z-10 h-14 w-14 border border-slate-100 rounded-2xl flex items-center justify-center bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => window.open('https://www.washvilla.com', '_blank')}>
            <Calendar className="text-slate-300" size={24} />
          </div>
          {/* Subtle decor */}
          <div className="absolute right-0 bottom-0 opacity-10 scale-150 rotate-[-15deg]">
            <Car size={180} />
          </div>
        </div>
      </div>

      {/* My Listings */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-medium text-[#1A2B3D] tracking-tight">My Vehicle Listings</h2>
            <p className="text-sm text-slate-400 font-medium">Real-time status of your active inventory.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#FDB813] text-[#1A2B3D] px-6 py-3 rounded-2xl text-xs font-medium shadow-lg shadow-yellow-500/10 active:scale-95 transition-all">
            <Plus size={16} strokeWidth={3} />
            Add New Vehicle
          </button>
        </div>

        {vehicleListings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vehicleListings.map(car => (
              <div key={car.id} className="bg-white p-4 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center gap-6 hover:shadow-md transition-all group">
                <div className="w-40 h-28 rounded-[2rem] overflow-hidden flex-shrink-0">
                  <img src={car.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex-1 py-1 pr-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-[#1A2B3D] tracking-tight">{car.name}</h3>
                    <span className={cn("text-[8px] font-medium px-2.5 py-1 rounded-lg uppercase tracking-widest", car.statusColor)}>
                      {car.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">{car.specs}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <span className="text-lg font-medium text-[#1A2B3D] tracking-tight">{car.price}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{car.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-50 p-16 text-center">
            <p className="text-slate-400 font-medium">No vehicle listings found.</p>
          </div>
        )}
      </section>

      {/* Activity */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-2xl font-medium text-[#1A2B3D] tracking-tight">Recent Activity</h2>
          <button className="text-[10px] font-medium uppercase tracking-widest text-slate-400 hover:text-[#1A2B3D] transition-colors">
            View all history
          </button>
        </div>
        
        {activities.length > 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm divide-y divide-slate-50 overflow-hidden">
            {activities.map(activity => (
              <div key={activity.id} className="p-8 flex items-start gap-5 hover:bg-slate-50/50 transition-colors group">
                <div className={cn("h-14 w-14 rounded-3xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110", activity.iconBg)}>
                  <activity.icon size={24} />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#1A2B3D] tracking-tight">{activity.text}</p>
                    {activity.hasDot && <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />}
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-50 p-16 text-center">
             <p className="text-slate-400 font-medium">No recent activity detected.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardHome;
