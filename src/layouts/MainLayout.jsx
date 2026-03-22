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
  User
} from 'lucide-react';

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <div className="bg-accent p-1.5 rounded-lg group-hover:bg-accent-light transition-colors shadow-sm">
      <Car className="w-5 h-5 text-primary fill-primary/10" />
    </div>
    <span className="font-black text-xl tracking-tight text-primary">Ridevendor</span>
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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Car Hire', path: '/car-hire' },
    { name: 'Car Sales', path: '/car-sales' },
    { name: 'Services', path: '/services' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full items-center justify-center flex bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-10 text-xs font-black uppercase tracking-widest text-slate-500">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={location.pathname === link.path ? "text-accent" : "hover:text-primary transition-colors"}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Auth Display */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-4 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-100 shadow-sm">
                <Link to="/dashboard" className="flex items-center gap-2 group">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs shadow-md group-hover:bg-slate-900 transition-colors">
                    {firstLetter}
                  </div>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Hi, {firstName}</span>
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
                  <Button variant="ghost" size="sm" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-primary hover:bg-slate-900 text-white rounded-xl px-6 py-5 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all active:scale-95">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Auth State (Just Icon if logged in) */}
          {isAuthenticated && (
            <Link to="/dashboard" className="md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white shadow-md active:scale-90 transition-all font-black text-xs">
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
                  className="text-lg font-black text-slate-900 uppercase tracking-widest py-2 border-b border-slate-50 flex items-center justify-between group"
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
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg">
                      {firstLetter}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged in as</p>
                      <p className="text-sm font-black text-slate-900 uppercase">My Dashboard</p>
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full py-7 rounded-2xl border-slate-200 text-red-500 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95"
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
                    <Button variant="outline" className="w-full py-7 rounded-2xl border-slate-200 text-primary font-black uppercase tracking-widest text-[11px]">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-accent hover:bg-accent-light text-primary py-7 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-accent/10">
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

const Footer = () => (
  <footer className="bg-[#0F172A] text-slate-300 pt-20 pb-10">
    <div className="container px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="bg-accent p-1.5 rounded-lg">
              <Car className="w-5 h-5 text-primary" />
            </div>
            <span className="font-black text-xl tracking-tight text-white">RideVendor</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs opacity-80">
            Shayongi Complex, No 84A, Tite Bridge Road, Ilorin 24001, Kwara
          </p>
          <div className="flex gap-4 pt-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Links</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">About</Link></li>
            <li><Link to="/services" className="hover:text-accent transition-colors">Services</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            <li><Link to="/shop" className="hover:text-accent transition-colors">Shop</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Services</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="/car-sales" className="hover:text-accent transition-colors">Car Sales</Link></li>
            <li><Link to="/car-hire" className="hover:text-accent transition-colors">Car Hire & Rentals</Link></li>
            <li><Link to="/services/rental" className="hover:text-accent transition-colors">Rentals & Services</Link></li>
            <li><Link to="/services/care" className="hover:text-accent transition-colors">Car Washing</Link></li>
            <li><Link to="/services/tracking" className="hover:text-accent transition-colors">Vehicle Tracking & Security</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold text-sm uppercase tracking-widest">Stay up to date</h4>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <button className="bg-white text-primary font-bold px-4 py-2 rounded-lg text-sm hover:bg-accent transition-colors">
              Subscribe
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Follow Us on:</p>
            <div className="flex gap-4">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-accent hover:text-primary transition-all"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-accent hover:text-primary transition-all"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-accent hover:text-primary transition-all"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-accent hover:text-primary transition-all"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
        <p>© {new Date().getFullYear()} Ride Vendor. All Rights Reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

const MainLayout = () => {
  return (
    <div className="flex items-center justify-center flex-col min-h-screen">
      <ScrollRestoration />
      <Navbar />
      <main className=" flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
