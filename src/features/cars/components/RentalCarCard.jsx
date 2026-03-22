import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Settings2, 
  Snowflake,
  MessageCircle
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import SafeImage from '../../../components/ui/SafeImage';
import Button from '../../../components/ui/Button';

const RentalCarCard = ({ car, className }) => {
  if (!car) return null;

  const {
    _id,
    title,
    brand,
    model,
    year,
    category,
    pricePerDay,
    images = [],
    transmission
  } = car;

  const primaryImage = images.find(img => img.isPrimary)?.url || images[0]?.url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800';

  const formattedPrice = pricePerDay?.toLocaleString();

  return (
    <div className={cn("group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2", className)}>
      <div className="relative aspect-[1.4/1] overflow-hidden bg-slate-900">
        <SafeImage
          src={primaryImage}
          alt={`${brand} ${model}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
        />
        
        <div className="absolute top-6 right-6">
          <div className="bg-[#F5F2EA] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-[#E8E1CF]">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8A6D3B]">Verified</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="space-y-3">
          <h3 className="font-black text-2xl text-slate-900 leading-tight">
            {title || `${brand} ${model}`}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-[#8A6D3B] uppercase tracking-widest opacity-80">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#8A6D3B] tracking-tighter">₦{formattedPrice}</span>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">/ Day</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to={`/car-hire/${_id}`} className="flex-1">
            <Button className="w-full bg-[#002D3A] hover:bg-[#001D26] text-white rounded-2xl py-7 font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-lg shadow-[#002D3A]/10">
              Book Now
            </Button>
          </Link>
          <button className="h-14 w-14 rounded-2xl flex items-center justify-center text-[#8A6D3B]/80 hover:text-[#8A6D3B] transition-all active:scale-90 border border-slate-100">
             <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalCarCard;
