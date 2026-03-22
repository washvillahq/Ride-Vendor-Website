import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Milestone, 
  Settings2, 
  MessageCircle,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import SafeImage from '../../../components/ui/SafeImage';
import Button from '../../../components/ui/Button';

const DetailedCarCard = ({ car, className }) => {
  if (!car) return null;

  const {
    _id,
    name,
    brand,
    model,
    year,
    type,
    category,
    location,
    pricePerDay,
    salePrice,
    mileage,
    transmission,
    images = [],
    status,
    description
  } = car;

  const primaryImage = images.find(img => img.isPrimary)?.url || images[0]?.url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800';

  const isRental = type === 'rental';
  const price = isRental ? pricePerDay : salePrice;
  const formattedPrice = price?.toLocaleString();

  return (
    <div className={cn("group bg-white rounded-[2rem] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2", className)}>
      <div className="relative aspect-[1.4/1] overflow-hidden">
        <SafeImage
          src={primaryImage}
          alt={`${brand} ${model}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-slate-200/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent fill-accent/20" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Verified</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="font-black text-xl text-slate-900 leading-tight">
            {year} {name || `${brand} ${model}`}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {category || 'Premium Luxury Package'}
          </p>
        </div>

        {/* Features Row */}
        <div className="flex gap-2">
          {[
            { icon: Milestone, label: mileage ? `${mileage.toLocaleString()} km` : '50k km' },
            { icon: Settings2, label: transmission || 'Auto' },
            { icon: MapPin, label: location || 'Ilorin' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
              <item.icon className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900 tracking-tighter">
                ₦{formattedPrice || '42,500,000'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <Link 
               to={isRental ? `/car-hire/${_id}` : `/cars/${_id}`} 
               className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-b-2 border-accent pb-0.5 hover:text-accent transition-colors"
             >
               View Details
             </Link>
             <button className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-primary hover:bg-accent-light transition-all active:scale-90 shadow-lg shadow-accent/20">
                <MessageCircle className="w-5 h-5 fill-primary" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedCarCard;
