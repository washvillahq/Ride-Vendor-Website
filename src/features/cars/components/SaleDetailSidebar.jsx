import React from 'react';
import { MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import Button from '../../../components/ui/Button';

const SaleDetailSidebar = ({ car }) => {
  if (!car) return null;

  const {
    brand,
    model,
    year,
    location,
    salePrice,
  } = car;

  const formattedPrice = salePrice?.toLocaleString() || '18,500,000';

  return (
    <div className="space-y-8 sticky top-24">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-medium text-[#1A2B3D] leading-tight">
            {year} {brand} {model}
          </h1>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{location || 'Ilorin, Kwara State'}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-medium text-[#1A2B3D] tracking-tighter">₦{formattedPrice}</span>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <Button className="w-full h-16 bg-[#FDB813] hover:bg-[#EAA810] text-[#1A2B3D] rounded-2xl font-medium text-xs uppercase tracking-widest shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-3 transition-all active:scale-95">
            <MessageCircle className="w-5 h-5 fill-primary" />
            Chat with Vendor
          </Button>
          <Button variant="outline" className="w-full h-16 border-slate-200 hover:bg-slate-50 text-[#1A2B3D] rounded-2xl font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95">
            <Phone className="w-5 h-5" />
            Call to Inquire
          </Button>
        </div>

        <div className="pt-8 border-t border-slate-50 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[#1A2B3D] text-white flex items-center justify-center font-medium text-sm">
            RV
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Listed by:</p>
            <p className="text-sm font-medium text-[#1A2B3D] leading-tight flex items-center gap-1.5">
              Ride Vendor Certified
              <ShieldCheck className="w-4 h-4 text-[#FDB813]" />
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#1A2B3D] p-8 rounded-[2rem] text-white space-y-4 shadow-xl shadow-primary/20 relative overflow-hidden group">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-[#FDB813]">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="font-medium text-xs uppercase tracking-widest">Buyer Protection Program</h4>
          </div>
          <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest opacity-70">
            Secure your purchase through our escrow service. Money is only released to the vendor once you've confirmed the vehicle's state in person.
          </p>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity rotate-[-15deg] group-hover:rotate-0 duration-500 scale-150 pointer-events-none">
          <ShieldCheck size={120} strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

export default SaleDetailSidebar;
