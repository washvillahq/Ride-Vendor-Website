import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../features/auth/hooks';
import Button from '../components/ui/Button';
import Seo from '../components/Seo';
import { cn } from '../utils/cn';
import {
  LayoutDashboard,
  Car,
  Settings,
  CalendarClock,
  ShoppingBag,
  Users,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  FileText,
  Mail,
  Globe
} from 'lucide-react';
const LOGO_WHITE = '/ride_vendor_logo_white.svg';

const AdminLayout = () => {
  const { user } = useAuthStore();
  const { mutate: logout, isLoading } = useLogout();
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Cars', path: '/admin/cars', icon: Car },
    { name: 'Services', path: '/admin/services', icon: Settings },
    { name: 'Global SEO', path: '/admin/seo-settings', icon: Globe },
    { name: 'CMS Pages', path: '/admin/pages', icon: FileText },
    { name: 'Contact Inbox', path: '/admin/contact', icon: Mail },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarClock },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFB]">
      <Seo title="Admin Dashboard" description="Manage RideVendor operations from the admin dashboard." />
      {/* Sidebar */}
      <aside className="w-72 bg-[#00212E] hidden lg:flex flex-col text-white shadow-[10px_0_40px_rgba(0,0,0,0.04)] border-r border-white/5">
        <div className="p-8 pb-12">
          <Link to="/admin" className="flex items-center gap-3 group">
            <img src={LOGO_WHITE} alt="Ridevendor" className="h-10 w-auto transition-transform group-hover:scale-105 duration-300" />
          </Link>
        </div>

        <nav className="flex-1 px-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 text-[11px] font-medium uppercase tracking-widest rounded-2xl transition-all duration-500",
                  isActive
                    ? 'bg-accent text-black shadow-xl shadow-accent/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={18} className={cn("transition-colors duration-500", isActive ? 'text-black' : 'text-slate-500 group-hover:text-white')} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 mt-auto border-t border-white/5">
          <Button
            variant="ghost"
            className="w-full justify-start text-[10px] font-medium uppercase tracking-widest text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-2xl px-5 py-4 transition-all"
            onClick={() => logout()}
            isLoading={isLoading}
          >
            <LogOut size={18} className="mr-4" />
            Terminate Session
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center px-8 justify-between sticky top-0 z-10">
          <div className="flex-1 max-w-md hidden lg:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Global admin search..."
                className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative h-12 w-12 flex items-center justify-center text-slate-400 hover:text-black hover:bg-slate-50 rounded-2xl transition-all">
              <Bell size={20} />
              <span className="absolute top-3.5 right-3.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white shadow-sm" />
            </button>
            <div className="h-8 w-[1px] bg-slate-100 mx-1" />
            <div className="flex items-center gap-4 pl-2 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-medium text-slate-900 leading-none uppercase tracking-widest">{user?.name || 'Administrator'}</p>
                <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-1.5 opacity-70">Super Admin</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-white border-2 border-slate-100 p-0.5 transition-transform group-hover:scale-105 duration-300">
                  <div className="h-full w-full rounded-xl bg-slate-900 flex items-center justify-center font-medium text-white text-[11px] uppercase tracking-tighter">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'AD'}
                  </div>
                </div>
                <ChevronDown size={14} className="text-slate-300 group-hover:text-black transition-colors md:block hidden" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-x-hidden bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
