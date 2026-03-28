import React from 'react';
import {
  Car,
  ShoppingBag,
  Package,
  Plus,
  Calendar,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const DashboardPage = () => {
  const { user } = useAuthStore();

  const actionCards = [
    {
      title: 'Book a Car',
      description: 'Fast bookings. Reliable services',
      icon: Car,
      buttonText: 'Book Now',
      bg: 'bg-white',
    },
    {
      title: 'Car Purchase',
      description: 'Quality Tokunbo and Nigerian-used Cars',
      icon: ShoppingBag,
      buttonText: 'Browse Vehicles',
      bg: 'bg-white',
    },
    {
      title: 'Car Accessories',
      description: 'Get Genuine Parts & Accessories',
      icon: Package,
      buttonText: 'Explore Catalogue',
      bg: 'bg-white',
    }
  ];

  const vehicleListings = [
    {
      id: 1,
      name: '2021 Lexus RX350',
      specs: 'V6 Engine • 12,400 mi • Premium Package',
      price: '₦45,000,000',
      status: 'VERIFIED & LIVE',
      statusColor: 'text-emerald-500 bg-emerald-50',
      time: 'Listed 2 days ago',
      image: 'https://images.unsplash.com/photo-1566473065135-321150ad01ff?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 2,
      name: '2020 Toyota Camry',
      specs: 'Hybrid LE • 34,000 mi • White Pearl',
      price: '₦22,500,000',
      status: 'AWAITING INSPECTION',
      statusColor: 'text-orange-500 bg-orange-50',
      time: 'Scheduled for tomorrow',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 3,
      name: '2019 Mercedes C300',
      specs: '4Matic • 45,000 mi • AMG Line',
      price: '₦31,000,000',
      status: 'VERIFIED & LIVE',
      statusColor: 'text-emerald-500 bg-emerald-50',
      time: 'Listed 1 week ago',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 4,
      name: '2022 Ford Explorer',
      specs: 'Limited • 8,500 mi • Panoramic Roof',
      price: '₦52,000,000',
      status: 'VERIFIED & LIVE',
      statusColor: 'text-emerald-500 bg-emerald-50',
      time: 'Listed today',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      text: 'Your 2018 Toyota Camry listing has been verified.',
      time: '2 hours ago',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500 bg-emerald-50'
    },
    {
      id: 2,
      text: 'Upcoming inspection at the Ilorin Hub tomorrow, 10:00AM.',
      time: 'Scheduled appointment',
      icon: Calendar,
      iconColor: 'text-orange-500 bg-orange-50',
      hasDot: true
    },
    {
      id: 3,
      text: 'You have 3 new inquiries for your Lexus RX350.',
      time: 'New messages',
      icon: MessageSquare,
      iconColor: 'text-blue-500 bg-blue-50',
      hasDot: true
    }
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Section */}
      <section>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0] || 'Paul'}!</h1>
        <p className="text-slate-500 mt-1">Manage your vehicles, rentals, and services in Ilorin.</p>
      </section>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actionCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
              <card.icon className="text-slate-900" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">{card.description}</p>
            <button className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${i === 0 ? 'bg-accent text-black hover:bg-accent-light' : 'bg-primary text-white hover:opacity-90'
              }`}>
              {card.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Hero Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-accent rounded-3xl p-8 relative overflow-hidden flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-black">List a Vehicle</h2>
            <p className="text-black/70 font-medium mt-1">Ready to sell? Get the best market value today.</p>
          </div>
          <button className="h-12 w-12 bg-white/30 backdrop-blur-md text-white rounded-2xl flex items-center justify-center hover:bg-white/40 transition-all">
            <Plus size={24} />
          </button>
        </div>
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-900">Need a wash?</h2>
            <p className="text-slate-500 font-medium mt-1">Get 10% off at Wash Villa on your next wash</p>
          </div>
          <div className="relative z-10 h-12 w-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm">
            <Calendar className="text-slate-400" size={20} />
          </div>
          {/* Abstract wash pattern decoration */}
          <div className="absolute top-0 right-0 w-32 h-full bg-blue-50/50 -mr-10 skew-x-12 group-hover:bg-blue-100/50 transition-colors" />
        </div>
      </div>

      {/* Vehicle Listings */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Vehicle Listings</h2>
            <p className="text-sm text-slate-500">Real-time status of your active inventory.</p>
          </div>
          <button className="flex items-center gap-2 bg-accent text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-accent-light transition-all shadow-sm">
            <Plus size={16} />
            Add New Vehicle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicleListings.map((car) => (
            <div key={car.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex gap-5 hover:shadow-md transition-all group">
              <div className="w-32 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1 py-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{car.name}</h3>
                  <span className={`text-[9px] font-medium px-2 py-0.5 rounded-lg uppercase tracking-wider ${car.statusColor}`}>
                    {car.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{car.specs}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-medium text-slate-900">{car.price}</span>
                  <span className="text-[10px] text-slate-400">{car.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
          <button className="text-xs font-bold text-accent-dark hover:underline flex items-center gap-1">
            View all history
          </button>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-6 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${activity.iconColor}`}>
                <activity.icon size={20} />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-800">{activity.text}</p>
                  {activity.hasDot && <span className="h-1.5 w-1.5 bg-orange-500 rounded-full" />}
                </div>
                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;

