import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCar, useCars } from '../features/cars/hooks';
import CarGallery from '../features/cars/components/CarGallery';
import SaleSpecsGrid from '../features/cars/components/SaleSpecsGrid';
import SaleDetailSidebar from '../features/cars/components/SaleDetailSidebar';
import SimpleCarCard from '../features/cars/components/SimpleCarCard';
import CarCardSkeleton from '../features/cars/components/CarCardSkeleton';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/feedback/ErrorState';
import { Search, CheckCircle2 } from 'lucide-react';

const CarDetailsSkeleton = () => (
  <div className="container py-8 space-y-12 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-8 space-y-10">
        <Skeleton className="aspect-[16/9] w-full rounded-[2.5rem]" />
        <Skeleton className="h-64 w-full rounded-[2.5rem]" />
      </div>
      <div className="lg:col-span-4 translate-y-24">
        <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
      </div>
    </div>
  </div>
);

const CarDetails = () => {
  const { carId } = useParams();
  const { data, isLoading, isError, refetch } = useCar(carId);
  const [searchTerm, setSearchTerm] = useState('');

  const car = data?.data;

  // Fetch similar cars
  const { data: similarData, isLoading: isSimilarLoading } = useCars({
    type: 'sale',
    category: car?.category,
    limit: 4
  });
  const similarCars = similarData?.data?.cars?.filter(c => c._id !== carId) || [];

  if (isLoading) return <CarDetailsSkeleton />;
  if (isError || !car) return <div className="container py-12"><ErrorState message="Vehicle not found or failed to load." onRetry={refetch} /></div>;

  const {
    brand,
    model,
    year,
    description,
    images = []
  } = car;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container px-4 py-8 space-y-10">
        {/* Top Header Row with Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <Breadcrumbs
            items={[
              { label: 'Home', link: '/' },
              // { label: 'Services', link: '/services' },
              { label: 'Car Sales', link: '/car-sales' },
              { label: `${year} ${brand} ${model}` }
            ]}
          />

          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-yellow-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by brand, model, or year..."
              className="w-full bg-slate-50 border border-slate-100 rounded-full pl-14 pr-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-12">
            <CarGallery images={images} />

            <SaleSpecsGrid specs={car} />

            {/* 360 Inspection Report */}
            <div className="space-y-6 bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-medium text-[#1A2B3D] tracking-tight">360° Inspection Report</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-medium text-green-500">9.2</span>
                  <span className="text-xs font-bold text-slate-400 capitalize">/10</span>
                </div>
              </div>

              {/* Score Bar */}
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[92%] rounded-full shadow-sm" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  'Engine & Transmission', 'Electrical Systems',
                  'Accident History', 'Suspension & Braking'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-xs font-bold text-[#1A2B3D]">{item}</span>
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-2 text-[#B8860B] font-bold text-[10px] uppercase tracking-widest pt-4 hover:gap-3 transition-all">
                <span className="w-4 h-0.5 bg-[#B8860B]" /> Download Full PDF Inspection Report
              </button>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-medium text-[#1A2B3D] tracking-tight">Vehicle Description</h2>
              <p className="text-slate-500 text-base font-medium leading-relaxed">
                {description || `${brand} ${model} embodies luxury and reliability. Imported directly (Tokunbo), it features a sophisticated exterior paired with a meticulously maintained premium interior. The smooth engine provides effortless power across all terrains.`}
              </p>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4">
            <SaleDetailSidebar car={car} />
          </div>
        </div>

        {/* Similar Cars Section */}
        <div className="space-y-8 pt-12 border-t border-slate-100">
          <h2 className="text-3xl font-medium text-[#1A2B3D] tracking-tight">You might also like</h2>
          {isSimilarLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array(4).fill(0).map((_, i) => <CarCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarCars.length > 0 ? (
                similarCars.map(car => (
                  <SimpleCarCard key={car._id} car={car} />
                ))
              ) : (
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No similar vehicles found at the moment.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
