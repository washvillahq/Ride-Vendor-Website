import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../utils/cn';
import SafeImage from '../../../components/ui/SafeImage';

const CarGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) return null;

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[1.6/1] rounded-[2.5rem] overflow-hidden group border border-slate-100 shadow-sm">
        <SafeImage 
          src={images[activeIndex]?.url} 
          alt="Car view" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        <div className="absolute top-6 left-6">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-slate-200/50">
            <CheckCircle2 className="w-4 h-4 text-accent fill-accent/20" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Verified</span>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={(e) => { e.preventDefault(); prevSlide(); }} 
          className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center z-10 transition-all hover:bg-black/60 active:scale-90"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); nextSlide(); }} 
          className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center z-10 transition-all hover:bg-black/60 active:scale-90"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative flex-shrink-0 w-32 aspect-video rounded-2xl overflow-hidden border-2 transition-all",
              activeIndex === i ? "border-accent ring-2 ring-accent/20" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <SafeImage src={img.url} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CarGallery;
