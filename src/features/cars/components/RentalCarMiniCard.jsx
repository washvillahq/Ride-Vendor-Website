import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Settings2 } from 'lucide-react';
import { cn } from '../../../utils/cn';
import SafeImage from '../../../components/ui/SafeImage';

const RentalCarMiniCard = ({ car, className }) => {
  if (!car) return null;

  const {
    _id,
    brand,
    model,
    pricePerDay,
    seatingCapacity,
    transmission,
    images = []
  } = car;

  const primaryImage = images.find(img => img.isPrimary)?.url || images[0]?.url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800';
  const formattedPrice = pricePerDay?.toLocaleString() || '45,000';

  return (
    <Link
      to={`/car-hire/${_id}`}
      className={cn("group block bg-white rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[1.5rem]">
        <SafeImage
          src={primaryImage}
          alt={`${brand} ${model}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-100 flex items-center justify-center">
            <span className="text-[11px] font-semibold text-[#1A2B3D]">₦{formattedPrice}/Day</span>
          </div>
        </div>
      </div>

      <div className="py-5  p-3 space-y-3">
        <h3 className="text-xl font-semibold text-[#1A2B3D] tracking-tight group-hover:text-primary transition-colors">
          {brand} {model}
        </h3>

        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold">{seatingCapacity || '5'} Seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings2 className="w-4 h-4" />
            <span className="text-xs font-bold">{transmission || 'Auto'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RentalCarMiniCard;
