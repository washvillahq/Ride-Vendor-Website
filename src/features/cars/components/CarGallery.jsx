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
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-slate-200/50 border border-slate-100/50 bg-slate-50">
        <SafeImage
          src={images[activeIndex]?.url}
          alt="Car view"
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
        />

        {/* Verified Badge */}
        <div className="absolute top-8 left-8">
          <div className="bg-white px-4 py-2 rounded-full flex items-center gap-2 shadow-xl border border-slate-100 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-4 h-4 text-[#fff] fill-[#001822]" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-[#001822]">Verified</span>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => { e.preventDefault(); prevSlide(); }}
          className="absolute left-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full flex items-center justify-center z-10 transition-all hover:bg-white/10 active:scale-90"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg" strokeWidth={3} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); nextSlide(); }}
          className="absolute right-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full flex items-center justify-center z-10 transition-all hover:bg-white/10 active:scale-90"
          aria-label="Next image"
        >
          <ChevronRight className="w-8 h-8 text-white drop-shadow-lg" strokeWidth={3} />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative flex-shrink-0 w-36 aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-300 transform",
              activeIndex === i
                ? "ring-4 ring-[#FDB813] ring-offset-2 scale-95 shadow-lg shadow-yellow-500/20"
                : "opacity-40 hover:opacity-100 hover:scale-105 border border-slate-200"
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
