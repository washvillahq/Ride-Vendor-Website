import React, { useState } from 'react';
import { Outlet, Link, useLocation, ScrollRestoration } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../features/auth/hooks';
import Button from '../components/ui/Button';

import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Car,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User,
  MessageCircle
} from 'lucide-react';

// import logo from '../assets/ridevendor_logo.png';
const LOGO_BLACK = '/ride_vendor_logo_black.svg';
const LOGO_WHITE = '/ride_vendor_logo_white.svg';

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <img src={LOGO_BLACK} alt="Ridevendor Logo" className="h-8 w-auto group-hover:scale-105 transition-transform duration-300" />
  </Link>
);

const Navbar = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { mutate: logout, isLoading } = useLogout();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  if (isAuthPage) return null;

  const firstLetter = user?.name?.charAt(0) || 'U';
  const firstName = user?.name?.split(' ')[0] || 'User';
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Car Hire', path: '/car-hire' },
    { name: 'Car Sales', path: '/car-sales' },
    { name: 'Services', path: '/services' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full z-[1000] items-center justify-center flex bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Logo />

          {/* Desktop Nav */}
          {/* <nav className="hidden lg:flex items-center space-x-10 text-xs font-medium uppercase tracking-widest text-slate-500">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={location.pathname === link.path ? "text-accent" : "hover:text-primary transition-colors"}
              >
                {link.name}
              </Link>
            ))}
          </nav> */}
        </div>

        <div className="flex items-center gap-4">
          {/* Auth Display */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-4 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-100 shadow-sm">
                <Link to={dashboardPath} className="flex items-center gap-2 group">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-medium text-xs shadow-md group-hover:bg-slate-900 transition-colors">
                    {firstLetter}
                  </div>
                  <span className="text-xs font-medium text-slate-900 uppercase tracking-tight">Hi, {firstName}</span>
                </Link>
                <div className="w-px h-4 bg-slate-200" />
                <button
                  onClick={() => logout()}
                  disabled={isLoading}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="Logout account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link to="/login">
                  <Button
                    variant="nav-outline"
                    size="sm"
                    isPill={true}
                    leftIcon={<User size={14} />}
                    className="text-[10px] font-medium uppercase tracking-widest px-6 h-11"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="nav-solid"
                    size="sm"
                    isPill={true}
                    className="text-[10px] font-medium uppercase tracking-widest px-8 h-11"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Auth State (Just Icon if logged in) */}
          {isAuthenticated && (
            <Link to={dashboardPath} className="md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white shadow-md active:scale-90 transition-all font-medium text-xs">
              {firstLetter}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden h-10 w-10 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 text-primary shadow-sm active:scale-90 transition-all"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="container px-4 py-8 space-y-8">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-medium text-slate-900 uppercase tracking-widest py-2 border-b border-slate-50 flex items-center justify-between group"
                >
                  {link.name}
                  <div className="h-2 w-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </nav>

            <div className="space-y-4 pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center font-medium text-lg">
                      {firstLetter}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Logged in as</p>
                      <p className="text-sm font-medium text-slate-900 uppercase">My Dashboard</p>
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full py-7 rounded-2xl border-slate-200 text-red-500 font-medium uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    Logout Account
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="nav-outline"
                      isPill={true}
                      leftIcon={<User size={16} />}
                      className="w-full py-7 font-medium uppercase tracking-widest text-[11px]"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="nav-solid"
                      isPill={true}
                      className="w-full py-7 font-medium uppercase tracking-widest text-[11px]"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

import visaIcon from '../assets/logos_visa.svg';
import mastercardIcon from '../assets/logos_mastercard.svg';
import paystackIcon from '../assets/paystack.svg';

const Footer = () => (
  <footer className="bg-primary px-4 md:px-0 text-gray-200 pt-20 pb-10">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO_WHITE} alt="Ridevendor" className="h-6 w-auto" />
          </Link>
          <p className="text-sm leading-relaxed max-w-xs opacity-80">
            Oniyangi Complex, Ita-Elepa,
            OFFA GARAGE RAILWAY LINE,
            off Asa-Dam Road, Ilorin 240101, Kwara
          </p>
          <div className="flex items-center gap-8 pt-4">
            <img src={visaIcon} alt="Visa" className="h-4 opacity-70 hover:opacity-100 transition-all cursor-pointer" />
            <img src={paystackIcon} alt="Paystack" className="h-5 opacity-70 hover:opacity-100 transition-all cursor-pointer" />
            <img src={mastercardIcon} alt="Mastercard" className="h-6 opacity-70 hover:opacity-100 transition-all cursor-pointer" />
          </div>
        </div>

        <div>
          <h4 className="text-gray-200 font-medium mb-6 text-sm uppercase tracking-widest">Links</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">About</Link></li>
            <li><Link to="/services" className="hover:text-accent transition-colors">Services</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            <li><Link to="/shop" className="hover:text-accent transition-colors">Shop</Link></li>
            <li><Link to="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-200 font-medium mb-6 text-sm uppercase tracking-widest">Services</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="/car-sales" className="hover:text-accent transition-colors">Car Sales</Link></li>
            <li><Link to="/car-hire" className="hover:text-accent transition-colors">Car Hire & Rentals</Link></li>
            <li><Link to="/services/rental" className="hover:text-accent transition-colors">Rentals & Services</Link></li>
            <li><Link to="/services/care" className="hover:text-accent transition-colors">Car Washing</Link></li>
            <li><Link to="/services/tracking" className="hover:text-accent transition-colors">Vehicle Tracking & Security</Link></li>
            <li><Link to="/logistics" className="hover:text-accent transition-colors">Bike Delivery & Logistics</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-gray-200 font-medium text-sm uppercase tracking-widest">Stay up to date</h4>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-700 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <button className="bg-white text-primary font-medium px-4 py-2 rounded-lg text-sm hover:bg-accent transition-colors">
              Subscribe
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Follow Us on:</p>
            <div className="flex gap-4">
              <a href="#" className=" p-2 rounded-full hover:bg-accent hover:text-primary transition-all"><Twitter className="w-4 h-4" /></a>
              <a href="#" className=" p-2 rounded-full hover:bg-accent hover:text-primary transition-all"><Facebook className="w-4 h-4" /></a>
              <a href="#" className=" p-2 rounded-full hover:bg-accent hover:text-primary transition-all"><Instagram className="w-4 h-4" /></a>
              <a href="#" className=" p-2 rounded-full hover:bg-accent hover:text-primary transition-all"><Youtube className="w-4 h-4" /></a>
              <a 
                href="https://wa.me/2348144123316?text=Hello%20Ride%20Vendor,%20I%20want%20to%20book%20a%20car" 
                target="_blank"
                rel="noopener noreferrer"
                className=" p-2 rounded-full hover:bg-accent hover:text-primary transition-all"
              >
                <div className="w-4 h-4">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
        <p>© {new Date().getFullYear()} Ride Vendor. All Rights Reserved.</p>
        <div className="flex gap-8">
          <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          <Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </div>
  </footer>
);

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollRestoration />
      <Navbar />
      <main className="px-2 md:px-8 flex items-center justify-center flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
