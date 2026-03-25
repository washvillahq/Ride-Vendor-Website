import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import loginImg from '../assets/loginimage.png';
import registerImg from '../assets/registerimage.png';
// import logo from '../assets/ridevendor_logo.png';
const LOGO_WHITE = '/ride_vendor_logo_white.svg';

const AuthLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const displayImg = isLogin ? loginImg : registerImg;

  return (
    <div className="min-h-screen flex flex-col  md:flex-row bg-white">
      {/* Left Side: Visual & Branding */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-slate-900">
        <img
          src={displayImg}
          alt="Authentication Visual"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#002E3E]/80 via-transparent to-transparent opacity-80" />

        <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO_WHITE} alt="Ridevendor" className="h-10 w-auto" />
          </Link>

          <div className="space-y-4 max-w-md">
            <h1 className="text-4xl font-black text-white leading-tight tracking-tighter">
              {isLogin ? "Ilorin’s premier automobile marketplace" : "Ilorin’s premier automobile marketplace"}
            </h1>
            <div className="h-1.5 w-16 bg-accent rounded-full" />
          </div>
        </div>
      </div>

      {/* Right Side: Form Area */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        <div className="absolute top-8 right-8 z-10">
          <Link to="/" className="text-slate-400 font-medium hover:text-slate-900 transition-colors text-sm">
            Back to Home
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-20">
          <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-right-4 duration-700">
            <Outlet />
          </div>
        </div>

        {/* Footer Links */}
        <div className="p-8 flex items-center justify-between border-t border-slate-50 text-[10px] font-medium uppercase tracking-widest text-slate-400">
          <span>© 2026 Ride Vendor. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
