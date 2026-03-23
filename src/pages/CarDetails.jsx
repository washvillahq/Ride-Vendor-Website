import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCar, useCars } from '../features/cars/hooks';
import CarGallery from '../features/cars/components/CarGallery';
import SpecsGrid from '../features/cars/components/SpecsGrid';
import InspectionReport from '../features/cars/components/InspectionReport';
import DetailSidebar from '../features/cars/components/DetailSidebar';
import DetailedCarCard from '../features/cars/components/DetailedCarCard';
import CarCardSkeleton from '../features/cars/components/CarCardSkeleton';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/feedback/ErrorState';
import { Search } from 'lucide-react';

const CarDetailsSkeleton = () => (
  <div className="container py-8 space-y-12 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-8 space-y-10">
        <Skeleton className="aspect-[1.6/1] w-full rounded-[2.5rem]" />
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
    category: car?.category,
    limit: 4
  });
  const similarCars = similarData?.data?.cars?.filter(c => c._id !== carId) || [];

  if (isLoading) return <CarDetailsSkeleton />;
  if (isError || !car) return <div className="container py-12"><ErrorState message="Car not found or failed to load." onRetry={refetch} /></div>;

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
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <Breadcrumbs
            items={[
              { label: 'Services', link: '/services' },
              { label: 'Car Sales', link: '/car-sales' },
              { label: `${year} ${brand} ${model}` }
            ]}
          />

          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search by brand, model, or year..."
              className="w-full bg-slate-50 border border-slate-100 rounded-full pl-14 pr-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-accent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-12">
            <CarGallery images={images} />

            <SpecsGrid specs={car} />

            <InspectionReport />

            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Vehicle Description</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {description || "No description provided for this vehicle."}
              </p>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4">
            <DetailSidebar car={car} />
          </div>
        </div>

        {/* Similar Cars Section */}
        <div className="space-y-8 pt-12 border-t border-slate-100">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">You might also like</h2>

          {isSimilarLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array(4).fill(0).map((_, i) => <CarCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarCars.length > 0 ? (
                similarCars.map(car => (
                  <DetailedCarCard key={car._id} car={car} />
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
