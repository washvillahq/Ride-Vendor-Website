import React from 'react';
import { Heart } from 'lucide-react';

const SavedVehicles = () => {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Saved Vehicles</h1>
          <p className="text-slate-500 font-medium tracking-tight">Vehicles you have saved for later.</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-16 text-center space-y-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
          <Heart size={40} strokeWidth={1} />
        </div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">No Saved Vehicles</h3>
        <p className="text-slate-400 font-medium text-sm max-w-sm">You haven't saved any vehicles yet. Browse our catalog and save your favorites here.</p>
        <button 
          onClick={() => window.location.href = '/car-hire'}
          className="mt-6 px-6 py-3 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-primary transition-all"
        >
          Explore Cars
        </button>
      </div>
    </div>
  );
};

export default SavedVehicles;
