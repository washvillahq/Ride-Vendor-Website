import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import SafeImage from '../../../components/ui/SafeImage';

const ImageGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden border bg-slate-100 shadow-2xl relative">
        <SafeImage
          src={images[activeIndex]?.url}
          alt="Car view"
          className="w-full h-full object-cover animate-fade-in"
        />
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "aspect-square rounded-2xl overflow-hidden border-2 transition-all",
                activeIndex === idx ? "border-black scale-95 shadow-lg" : "border-transparent hover:border-slate-300"
              )}
            >
              <SafeImage src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
