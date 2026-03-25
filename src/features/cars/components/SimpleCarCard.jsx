import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import SafeImage from '../../../components/ui/SafeImage';

const SimpleCarCard = ({ car, className }) => {
  if (!car) return null;

  const {
    _id,
    title,
    brand,
    model,
    year,
    condition,
    type,
    pricePerDay,
    salePrice,
    images = []
  } = car;

  const primaryImage = images.find(img => img.isPrimary)?.url || images[0]?.url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800';

  const isRental = type === 'rental' || !salePrice;
  const price = isRental ? pricePerDay : salePrice;
  const formattedPrice = price?.toLocaleString();

  return (
    <Link
      to={isRental ? `/car-hire/${_id}` : `/cars/${_id}`}
      className={cn("group block bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2", className)}
    >
      <div className="relative aspect-[1.2/1] overflow-hidden bg-gray-50">
        <SafeImage
          src={primaryImage}
          alt={`${brand} ${model}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="p-4 space-y-3 bg-[#fff] shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#8A6D3B] uppercase tracking-widest leading-none">
            {year} • {condition || 'TOKUNBO'}
          </span>
        </div>

        <h3 className="font-semibold text-lg text-[#002E3E] leading-tight line-clamp-1">
          {title || `${brand} ${model}`}
        </h3>

        <div className="flex items-baseline gap-1">
          <span className="text-md font-medium text-[#002E3E] tracking-tighter">
            ₦{formattedPrice}{!isRental && 'M'}
          </span>
          {isRental && <span className="text-[11px] font-medium text-gray-medium uppercase tracking-widest opacity-60">/ Day</span>}
        </div>
      </div>
    </Link>
  );
};

export default SimpleCarCard;
