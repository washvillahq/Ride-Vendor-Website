import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';
import Button from '../../../components/ui/Button';

const RentalDetailSidebar = ({ car, onBookNow }) => {
  if (!car) return null;

  const {
    title,
    brand,
    model,
    year,
    location,
    pricePerDay,
  } = car;

  const formattedPrice = pricePerDay?.toLocaleString();

  const rentalBenefits = [
    { icon: CheckCircle2, text: "Comprehensive Insurance Included" },
    { icon: Clock, text: "24/7 Roadside Assistance" },
    { icon: Calendar, text: "Flexible Booking Extention" },
  ];

  return (
    <div className="space-y-8 sticky top-24">
      <div className="space-y-6 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 leading-tight">
            {year} {title || `${brand} ${model}`}
          </h1>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{location || 'Ilorin, Kwara State'}</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black text-[#8A6D3B] uppercase tracking-[0.2em] leading-none">Rental Price</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-[#8A6D3B] tracking-tighter">₦{formattedPrice || '45,000'}</span>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">/ Day</span>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <Button 
            onClick={onBookNow}
            className="w-full bg-[#002D3A] hover:bg-[#001D26] text-white py-7 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-[#002D3A]/20"
          >
            Book This Car Now
          </Button>
          <Button variant="outline" className="w-full border-[#8A6D3B]/20 hover:bg-slate-50 text-[#8A6D3B] py-7 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95">
            <MessageCircle className="w-5 h-5 fill-[#8A6D3B]/20" />
            Chat with Owner
          </Button>
        </div>

        {/* Benefits */}
        <div className="pt-6 space-y-4 border-t border-slate-50">
          {rentalBenefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-3">
               <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center">
                 <benefit.icon className="w-3.5 h-3.5 text-[#8A6D3B]" />
               </div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{benefit.text}</span>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-50 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm">
            RV
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Managed by:</p>
            <p className="text-sm font-black text-slate-900 leading-tight flex items-center gap-1.5">
              Ride Vendor Premium
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#002D3A] p-8 rounded-[2rem] text-white space-y-4 shadow-xl shadow-[#002D3A]/20 relative overflow-hidden group">
         <div className="relative z-10 space-y-3">
           <div className="flex items-center gap-2 text-accent">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-black text-sm uppercase tracking-widest">Premium Hire Protection</h4>
           </div>
           <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-wider">
             Your safety is our priority. Every rental includes verified vehicle diagnostics and primary insurance coverage for your peace of mind.
           </p>
         </div>
         <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity rotate-[-15deg] group-hover:rotate-0 duration-500 scale-150 pointer-events-none">
            <ShieldCheck size={120} strokeWidth={1} />
         </div>
      </div>
    </div>
  );
};

export default RentalDetailSidebar;
