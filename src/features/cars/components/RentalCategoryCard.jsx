import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../utils/cn';

const RentalCategoryCard = ({ title, description, image, className, link }) => {
  return (
    <Link
      to={link || '#'}
      className={cn("relative group h-[280px] rounded-[2rem] overflow-hidden cursor-pointer block", className)}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />

      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-lg font-medium text-white leading-tight">{title}</h3>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest group-hover:opacity-100 transition-opacity duration-500">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RentalCategoryCard;
