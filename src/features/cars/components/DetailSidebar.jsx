import React from 'react';
import { MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import Button from '../../../components/ui/Button';

const DetailSidebar = ({ car }) => {
  if (!car) return null;

  const {
    name,
    brand,
    model,
    year,
    location,
    pricePerDay,
    salePrice,
    type
  } = car;

  const isRental = type === 'rental';
  const price = isRental ? pricePerDay : salePrice;
  const formattedPrice = price?.toLocaleString();

  return (
    <div className="space-y-8 sticky top-24">
      <div className="space-y-6 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 leading-tight">
            {year} {name || `${brand} ${model}`}
          </h1>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{location || 'Ilorin, Kwara State'}</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Price</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-slate-900 tracking-tighter">₦{formattedPrice || '18,500,000'}</span>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <Button className="w-full bg-accent hover:bg-accent-light text-primary py-7 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-accent/20">
            <MessageCircle className="w-5 h-5 fill-primary" />
            Chat with Vendor
          </Button>
          <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50 text-slate-900 py-7 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95">
            <Phone className="w-5 h-5" />
            Call to Inquire
          </Button>
        </div>

        <div className="pt-8 border-t border-slate-50 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm">
            RV
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Listed by:</p>
            <p className="text-sm font-black text-slate-900 leading-tight flex items-center gap-1.5">
              Ride Vendor Certified
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            </p>
          </div>
        </div>
      </div>

      <div className="bg-primary p-8 rounded-[2rem] text-white space-y-4 shadow-xl shadow-primary/20 relative overflow-hidden group">
         <div className="relative z-10 space-y-3">
           <div className="flex items-center gap-2 text-accent">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-black text-sm uppercase tracking-widest">Buyer Protection Program</h4>
           </div>
           <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-wider">
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

export default DetailSidebar;
