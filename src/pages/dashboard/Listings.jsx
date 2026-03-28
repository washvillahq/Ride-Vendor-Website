import React from 'react';
import { List } from 'lucide-react';

const Listings = () => {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-medium text-slate-900 tracking-tighter">My Listings</h1>
          <p className="text-slate-500 font-medium tracking-tight">Manage your vehicle listings available for hire or sale.</p>
        </div>
        <button
          className="px-6 py-3 rounded-xl bg-accent text-primary text-[10px] font-medium uppercase tracking-widest hover:bg-accent/90 transition-all shadow-md"
        >
          Add New Listing
        </button>
      </div>

      <div className="flex flex-col items-center justify-center p-16 text-center space-y-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
          <List size={40} strokeWidth={1} />
        </div>
        <h3 className="text-xl font-medium text-slate-900 tracking-tight">No Active Listings</h3>
        <p className="text-slate-400 font-medium text-sm max-w-sm">You haven't listed any vehicles yet. Create a listing to start earning from your vehicle.</p>
      </div>
    </div>
  );
};

export default Listings;
