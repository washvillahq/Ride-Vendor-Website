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
  ShieldCheck
} from 'lucide-react';
import logo from '../assets/ridevendor_logo.png';

const DashboardLayout = () => {
  const { user } = useAuthStore();
  const { mutate: logout, isLoading } = useLogout();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Bookings', path: '/dashboard/bookings', icon: CalendarClock },
    { name: 'Orders', path: '/dashboard/orders', icon: ShoppingBag },
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

        <nav className="flex-1 px-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-accent text-primary shadow-xl shadow-accent/10 translate-x-2' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-primary' : 'text-slate-400'} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-white/5 rounded-[2rem] p-6 space-y-4 border border-white/5">
             <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                 <ShieldCheck size={20} />
               </div>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Account status</p>
                 <p className="text-xs font-bold text-white">Verified Member</p>
               </div>
             </div>
             <Button 
                variant="ghost" 
                className="w-full justify-start text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl px-4 py-3" 
                onClick={() => logout()}
                isLoading={isLoading}
              >
                <LogOut size={16} className="mr-3" />
                Sign Out
              </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center px-8 justify-between border-b border-slate-100">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden h-10 w-10 bg-accent rounded-xl flex items-center justify-center font-black text-primary shadow-lg">
            <Menu size={20} />
          </button>
          
          <div className="hidden lg:flex items-center gap-2 text-slate-400">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">System Operational</span>
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
                <div className="h-11 w-11 rounded-2xl bg-[#002E3E] border-4 border-white shadow-xl flex items-center justify-center font-black text-white overflow-hidden">
                   {user?.name?.charAt(0) || 'U'}
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
