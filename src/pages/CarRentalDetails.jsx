import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCar, useCars } from '../features/cars/hooks';
import CarGallery from '../features/cars/components/CarGallery';
import SpecsGrid from '../features/cars/components/SpecsGrid';
import RentalDetailSidebar from '../features/cars/components/RentalDetailSidebar';
import SimpleCarCard from '../features/cars/components/SimpleCarCard';
import CarCardSkeleton from '../features/cars/components/CarCardSkeleton';
import HireCheckoutModal from '../features/cars/components/HireCheckoutModal';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/feedback/ErrorState';
import { Search, ShieldCheck, CheckCircle2 } from 'lucide-react';

const RentalDetailsSkeleton = () => (
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

const CarRentalDetails = () => {
  const { carId } = useParams();
  const { data, isLoading, isError, refetch } = useCar(carId);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const car = data?.data;

  // Fetch similar rental cars
  const { data: similarData, isLoading: isSimilarLoading } = useCars({
    type: 'rental',
    category: car?.category,
    limit: 4
  });
  const similarCars = similarData?.data?.cars?.filter(c => c._id !== carId) || [];

  if (isLoading) return <RentalDetailsSkeleton />;
  if (isError || !car) return <div className="container py-12"><ErrorState message="Rental vehicle not found or failed to load." onRetry={refetch} /></div>;

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
              { label: 'Car Hire', link: '/car-hire' },
              { label: `${year} ${brand} ${model}` }
            ]}
          />

          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search for car hire..."
              className="w-full bg-slate-50 border border-slate-100 rounded-full pl-14 pr-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-accent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            <CarGallery images={images} />

            <SpecsGrid specs={car} />

            {/* Condition Certificate */}
            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-medium text-[#002E3E] tracking-tight">Condition Certificate</h2>
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-2xl">
                  This vehicle has passed our 150-point safety and condition inspection. We ensure every hire vehicle meets our premium standards for reliability and cleanliness.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  {['Brakes Verified', 'AC Functional', 'Tires Inspected', 'Clean Interior'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span className="text-[10px] font-medium uppercase tracking-widest text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 opacity-[0.03] rotate-12 pointer-events-none">
                <ShieldCheck size={300} strokeWidth={1} />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-medium text-[#002E3E] tracking-tight">Vehicle Description</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {description || "No description provided for this hire vehicle. Contact vendor for specific details."}
              </p>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4">
            <RentalDetailSidebar car={car} onBookNow={() => setIsCheckoutOpen(true)} />
          </div>
        </div>

        {/* Similar Hire Cars Section */}
        <div className="space-y-8 pt-12 border-t border-slate-100">
          <h2 className="text-3xl font-medium text-[#002E3E] tracking-tight">You might also like</h2>

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
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No similar hire vehicles found at the moment.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {car && (
        <HireCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          car={car}
        />
      )}
    </div>
  );
};

export default CarRentalDetails;
