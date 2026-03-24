import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../features/auth/hooks';
import Button from '../components/ui/Button';
import { 
  LayoutDashboard, 
  CalendarClock, 
  ShoppingBag, 
  User, 
  LogOut, 
  Bell,
  Menu,
  ShieldCheck,
  Search,
  HelpCircle,
  Car,
  List,
  Heart,
  CreditCard,
  LogOut as LogOutIcon
} from 'lucide-react';
import logo from '../assets/ridevendor_white.png';

const DashboardLayout = () => {
  const { user } = useAuthStore();
  const { mutate: logout, isLoading } = useLogout();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Rentals', path: '/dashboard/bookings', icon: Car },
    { name: 'My Listings', path: '/dashboard/listings', icon: List },
    { name: 'Saved Vehicles', path: '/dashboard/saved', icon: Heart },
    { name: 'My Purchases', path: '/dashboard/orders', icon: CreditCard },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFB]">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-[#002E3E] fixed inset-y-0 left-0 z-40 lg:relative lg:flex flex-col text-white shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 pb-10 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Ridevendor" className="h-10 w-auto" />
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <Menu size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-5 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-accent text-black shadow-lg shadow-accent/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-black' : 'text-slate-400'} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-6 border-t border-white/5 flex flex-col gap-1">
            <Link 
              to="/help" 
              className="flex items-center gap-4 px-5 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <HelpCircle size={20} />
              Help Center
            </Link>
            <button 
              onClick={() => logout()}
              disabled={isLoading}
              className="flex items-center gap-4 px-5 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all w-full"
            >
              <LogOutIcon size={20} />
              Logout
            </button>
        </div>


      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center px-8 justify-between border-b border-slate-100">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden h-10 w-10 bg-accent rounded-xl flex items-center justify-center font-black text-primary shadow-lg">
            <Menu size={20} />
          </button>
          
          <div className="flex-1 max-w-md mx-8 hidden lg:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search orders..."
                className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-accent/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
             <button className="relative h-10 w-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
             </button>
             
             <div className="h-10 w-[1px] bg-slate-100 mx-1" />

             <div className="flex items-center gap-4 pl-2">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-black text-slate-900 leading-tight">{user?.name || 'User'}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{user?.role || 'customer'}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-[#002E3E] border border-slate-100 flex items-center justify-center font-bold text-white overflow-hidden text-sm">
                   {user?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
                </div>
             </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
