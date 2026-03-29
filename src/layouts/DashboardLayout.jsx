import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../features/auth/hooks';
import {
  LayoutDashboard,
  Car,
  List,
  Heart,
  ShoppingBag,
  User,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import logo from '../assets/ridevendor_white.png';
import { cn } from '../utils/cn';

const DashboardLayout = () => {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Book a Ride', path: '/dashboard/book-rental', icon: Search },
    { name: 'My Rentals', path: '/dashboard/bookings', icon: Car },
    { name: 'My Listings', path: '/dashboard/listings', icon: List },
    { name: 'Saved Vehicles', path: '/dashboard/saved', icon: Heart },
    { name: 'My Purchases', path: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFB]">


      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#002E3E] text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="RideVendor" className="h-6 w-auto" />
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all",
                  isActive
                    ? "bg-[#FDB813] text-[#002E3E]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-1 border-t border-white/5">
          <a 
            href="https://wa.me/2348144123316?text=Hello%20Ride%20Vendor,%20I%20want%20to%20book%20a%20car"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white transition-all"
          >
            <HelpCircle size={18} className="text-[#FDB813]" />
            Help Center
          </a>
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white transition-all w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-2 sticky top-0 z-30">
          <div className='flex gap-2 items-center'>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden z-50 p-2 bg-[#002E3E] text-white rounded-lg shadow-lg"
            >
              <Menu size={20} />
            </button>
            <div className="flex-1 max-w-md">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full bg-[#F4F7F9] border-none rounded-lg py-2 pl-12 pr-4 text-sm focus:ring-1 focus:ring-accent transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* <button className="relative text-slate-400 hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-orange-500 rounded-full border-2 border-white" />
            </button> */}

            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="h-10 w-10 rounded-full bg-[#002E3E] text-white flex items-center justify-center font-bold text-sm">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
