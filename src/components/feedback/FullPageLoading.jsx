import React from 'react';
import { Car, Fuel, Sparkles } from 'lucide-react';

const FullPageLoading = ({ message = 'Fueling your journey...' }) => {
   return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#1A2B3D] overflow-hidden">
         {/* Background Abstract Glows */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FDB813]/5 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full" />

         {/* Central Branded Animation */}
         <div className="relative flex flex-col items-center">
            {/* The "Car" Scanner */}
            <div className="relative group">
               {/* Speed Lines */}
               <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-20">
                  <div className="h-[2px] w-8 bg-white rounded-full animate-[ping_1.5s_infinite_0s]" />
                  <div className="h-[2px] w-12 bg-white rounded-full animate-[ping_1.5s_infinite_0.3s]" />
                  <div className="h-[2px] w-6 bg-white rounded-full animate-[ping_1.5s_infinite_0.6s]" />
               </div>

               <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-[#25394e] to-[#1A2B3D] border border-white/5 flex items-center justify-center shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FDB813]/10 to-transparent opacity-50 rounded-3xl" />
                  <Car size={42} className="text-[#FDB813] relative z-10 animate-bounce" style={{ animationDuration: '2s' }} />

                  {/* Scanning Ray */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FDB813] shadow-[0_0_15px_#FDB813] animate-[scan_2s_infinite_ease-in-out] opacity-60" />
               </div>

               <div className="absolute -right-8 -bottom-8 opacity-40">
                  <Sparkles className="text-[#FDB813] animate-pulse" size={24} />
               </div>
            </div>

            {/* Progress Text */}
            <div className="mt-12 text-center space-y-3 relative">
               <div className="flex items-center justify-center gap-3">
                  <h2 className="text-xl font-medium text-white tracking-[0.2em] uppercase">RideVendor</h2>
                  <div className="h-1 w-1 rounded-full bg-[#FDB813]" />
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Fleet OS</span>
               </div>
               <p className="text-slate-500 font-bold text-sm tracking-tight animate-pulse flex items-center justify-center gap-2">
                  <Fuel size={14} className="text-[#FDB813]" />
                  {message}
               </p>
            </div>
         </div>

         {/* Brand Footer */}
         <div className="absolute bottom-12 left-0 right-0 text-center">
            <p className="text-[8px] font-medium text-slate-700 uppercase tracking-[0.5em]">Seamless Mobility. Ultimate Freedom.</p>
         </div>

         <style dangerouslySetInnerHTML={{
            __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
      </div>
   );
};

export default FullPageLoading;
