import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import Badge from '../../../components/ui/Badge';
import { Card, CardContent, CardFooter } from '../../../components/ui/Card';
import SafeImage from '../../../components/ui/SafeImage';
import Button from '../../../components/ui/Button';

import { CheckCircle2, MapPin, ArrowRight, Heart } from 'lucide-react';

const CarCard = ({ car, className }) => {
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
    images = [],
    status
  } = car;

  const primaryImage = images.find(img => img.isPrimary)?.url || images[0]?.url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800';

  const isRental = type === 'rental';
  const price = isRental ? pricePerDay : salePrice;
  const formattedPrice = price?.toLocaleString();

  return (
    <div className={cn("group bg-white rounded-3xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2", className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <SafeImage
          src={primaryImage}
          alt={`${brand} ${model}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          fallbackSrc="https://via.placeholder.com/800x600?text=No+Image"
        />
        
        {/* Verified Badge */}
        <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-500">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-slate-200/50">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Verified</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-accent fill-accent/20" />
          </div>
        </div>

        {status && status !== 'available' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-white text-slate-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em]">
              {status}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               {category || (isRental ? 'Rental' : 'Sale')}
             </span>
             <div className="flex items-center gap-1 text-slate-400 group-hover:text-accent-dark transition-colors">
                <MapPin className="w-3 h-3" />
                <span className="text-[10px] font-bold">{location || 'Ilorin'}</span>
             </div>
          </div>
          <h3 className="font-black text-xl text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-1">
             {name || `${brand} ${model} V6`}
          </h3>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
            {isRental ? 'From' : 'Price'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 tracking-tighter">
              ₦{formattedPrice}
            </span>
            {isRental && <span className="text-sm font-bold text-slate-500 tracking-tight">/ Day</span>}
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Link to={isRental ? `/car-hire/${_id}` : `/cars/${_id}`} className="flex-1">
            <Button className="w-full bg-primary hover:bg-slate-900 text-white rounded-xl py-6 font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
              Book Now
            </Button>
          </Link>
          <button className="h-12 w-12 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-accent-dark transition-all active:scale-90">
             <Heart className="w-5 h-5 focus:fill-accent-dark" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
