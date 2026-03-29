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
    <div className={cn("group bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1", className)}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <SafeImage
          src={primaryImage}
          alt={`${brand} ${model}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
            <span className="text-[10px] font-medium uppercase tracking-widest text-primary/80">Verified</span>
          </div>
        </div>
      </div>

      <div className="p-2 space-y-2">
        <div className="space-y-2">
          <h3 className="font-medium text-2xl text-primary tracking-tight">
            {title || `${brand} ${model}`}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#8B7355] uppercase tracking-widest leading-none">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-medium text-[#8B7355] tracking-tight">₦{formattedPrice}</span>
              <span className="text-[12px] font-medium text-gray-medium uppercase tracking-widest">/ Day</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-y border-gray-50">
          <div className="flex flex-col items-center gap-2 text-primary/70">
            <Users className="w-4 h-4" />
            <span className="text-xs font-semibold">{car.seatingCapacity || 5}-Seater</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-primary/70">
            <Settings2 className="w-4 h-4" />
            <span className="text-xs font-semibold">{transmission || 'Auto'}</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-primary/70">
            <Snowflake className="w-4 h-4" />
            <span className="text-xs font-semibold">Full AC</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to={`/car-hire/${_id}`} className="flex-1">
            <Button className="w-full h-[45px] bg-[#1A2B3D] hover:bg-[#121F2C] text-white rounded-2xl font-medium text-sm transition-all active:scale-95 shadow-lg shadow-primary/10">
              Book Now
            </Button>
          </Link>
          <a 
            href="https://wa.me/2348144123316?text=Hello%20Ride%20Vendor,%20I%20want%20to%20book%20a%20car"
            target="_blank"
            rel="noopener noreferrer"
            className="h-[45px] w-[60px] rounded-2xl flex items-center justify-center bg-[#FDB813] hover:bg-[#EAA810] text-primary transition-all active:scale-95 shadow-lg shadow-yellow-500/10 shrink-0"
          >
            <MessageSquareText className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RentalCarCard;
