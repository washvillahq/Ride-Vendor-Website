import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Settings2,
  Snowflake,
  MessageSquareText
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
    <div className={cn("group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 transition-all duration-500 shadow-md hover:shadow-2xl hover:-translate-y-2", className)}>
      <div className="relative aspect-[1.4/1] overflow-hidden bg-primary">
        <SafeImage
          src={primaryImage}
          alt={`${brand} ${model}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
        />

        <div className="absolute top-6 right-6">
          <div className="bg-[#F5F2EA] px-3 py-1 rounded-full flex items-center gap-2 shadow-sm border border-[#E8E1CF]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A6D3B]">Verified</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-8">
        <div className="space-y-3">
          <h3 className="font-semibold text-2xl text-primary leading-tight">
            {title || `${brand} ${model}`}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-md font-medium text-[#8A6D3B] uppercase tracking-widest opacity-80">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-medium text-[#8A6D3B] tracking-tighter">₦{formattedPrice}</span>
              <span className="text-[11px] font-medium text-gray-medium uppercase tracking-widest">/ Day</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to={`/car-hire/${_id}`} className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl py-7 font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-lg shadow-primary/10">
              Book Now
            </Button>
          </Link>
          <button className="h-16 w-16 rounded-2xl flex items-center justify-center text-[#8A6D3B] hover:bg-[#FDF2F2] transition-all active:scale-90 border border-gray-100 bg-white">
            <MessageSquareText className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalCarCard;
