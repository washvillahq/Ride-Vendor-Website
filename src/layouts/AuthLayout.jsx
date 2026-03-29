import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Seo from '../components/Seo';
import loginImg from '../assets/loginimage.png';
import registerImg from '../assets/registerimage.png';
// import logo from '../assets/ridevendor_logo.png';
const LOGO_WHITE = '/ride_vendor_logo_white.svg';

const AuthLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const displayImg = isLogin ? loginImg : registerImg;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <Seo title={isLogin ? 'Login' : 'Register'} description="Access your RideVendor account." />
      {/* Visual & Branding Section - Now visible on all screens */}
      <div className="flex w-full md:w-1/2 h-[320px] md:h-auto relative overflow-hidden bg-slate-900 shrink-0">
        <img
          src={displayImg}
          alt="Authentication Visual"
          className="absolute inset-0 w-full h-full object-cover opacity-70 md:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#002E3E]/90 via-slate-900/40 to-transparent" />

        <div className="relative z-10 w-full h-full p-8 md:p-12 flex flex-col justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO_WHITE} alt="Ridevendor" className="h-8 md:h-10 w-auto" />
          </Link>

          <div className="space-y-4 max-w-md pb-4 md:pb-0">
            <div className="h-1 w-12 bg-accent rounded-full mb-4" />
            <h1 className="text-lg md:text-5xl font-semibold md:font-medium text-white leading-tight tracking-tighter">
              {isLogin ? "Ilorin’s premier automobile marketplace" : "Ilorin’s premier automobile marketplace"}
            </h1>
          </div>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-white">
        <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10">
          <Link to="/" className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 hover:text-black transition-all">
            Back to Home
          </Link>
        </div>

        <div className="w-full flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-20 py-16 md:py-20">
          <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-right-4 duration-700">
            <Outlet />
          </div>
        </div>

        {/* Footer Links (Conditional on screen size for better mobile flow) */}
        <div className="w-full p-8 flex flex-col sm:flex-row items-center justify-between border-t border-slate-50 text-[9px] font-bold uppercase tracking-widest text-slate-400 gap-4">
          <span>© 2026 Ride Vendor</span>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
