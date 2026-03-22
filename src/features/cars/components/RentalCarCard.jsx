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
    name,
    brand,
    model,
    year,
    category,
    rentalPrice,
    images = [],
    transmission,
    features = []
  } = car;

  const primaryImage = images.find(img => img.isPrimary)?.url || images[0]?.url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800';

  const formattedPrice = rentalPrice?.toLocaleString();

  return (
    <div className={cn("group bg-white rounded-[2rem] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2", className)}>
      <div className="relative aspect-[1.6/1] overflow-hidden border-b border-slate-50">
        <SafeImage
          src={primaryImage}
          alt={`${brand} ${model}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-slate-200/50">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none">Verified</span>
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-4">
          <h3 className="font-black text-2xl text-slate-900 leading-tight">
            {name || `${brand} ${model}`}
          </h3>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-accent uppercase tracking-widest">Price</span>
            <span className="text-xl font-black text-slate-900 tracking-tighter">₦{formattedPrice || '45,000'}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">/ Day</span>
          </div>
        </div>

        {/* Features Row */}
        <div className="flex items-center gap-6 py-4 border-t border-slate-50">
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-tight">5-Seater</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Settings2 className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-tight">{transmission || 'Auto'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Snowflake className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Full AC</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to={`/cars/${_id}`} className="flex-1">
            <Button className="w-full bg-primary hover:bg-slate-900 text-white rounded-2xl py-7 font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-lg shadow-primary/20">
              Book Now
            </Button>
          </Link>
          <button className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center text-primary hover:bg-accent-light transition-all active:scale-90 shadow-lg shadow-accent/20">
             <MessageCircle className="w-6 h-6 fill-primary" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalCarCard;
