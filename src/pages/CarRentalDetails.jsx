import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCar, useCars } from '../features/cars/hooks';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import CarGallery from '../features/cars/components/CarGallery';
import HireSpecsGrid from '../features/cars/components/HireSpecsGrid';
import HireDetailSidebar from '../features/cars/components/HireDetailSidebar';
import RentalCarMiniCard from '../features/cars/components/RentalCarMiniCard';
import CarCardSkeleton from '../features/cars/components/CarCardSkeleton';
import HireCheckoutModal from '../features/cars/components/HireCheckoutModal';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/feedback/ErrorState';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const RentalDetailsSkeleton = () => (
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

const CarRentalDetails = () => {
  const { carId } = useParams();
  const { data, isLoading, isError, refetch } = useCar(carId);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const car = data?.data;

  // Fetch similar rental cars
  const { data: similarData, isLoading: isSimilarLoading } = useCars({
    type: 'rental',
    category: car?.category,
    limit: 4
  });
  const similarCars = similarData?.data?.cars?.filter(c => c._id !== carId) || [];

  const handleBookNow = (data) => {
    if (!isAuthenticated) {
      toast.error('Please login to continue with your booking');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    setBookingData(data);
    setIsCheckoutOpen(true);
  };

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
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            // { label: 'Home', link: '/' },
            // { label: 'Services', link: '/services' },
            { label: 'Car Hire & Rentals', link: '/car-hire' },
            { label: `${brand} ${model}` }
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-12">
            <CarGallery images={images} />

            <div className="space-y-6">
              <h1 className="text-5xl font-black text-[#1A2B3D] tracking-tight">
                {brand} {model}
              </h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">
                {description || "The ultimate in spacious luxury for your Ilorin journey. Experience German engineering paired with unrivaled comfort."}
              </p>
            </div>

            <HireSpecsGrid specs={car} />

            {/* Key Features */}
            <div className="space-y-8 p-10 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {[
                  { title: 'Advanced Safety', desc: 'Active Brake Assist and Blind Spot Monitoring.' },
                  { title: 'MBUX Infotainment', desc: 'Voice-activated intelligence with dual 12.3" screens.' },
                  { title: 'Panoramic Sunroof', desc: 'Full-length glass roof for an airy, open-cabin feel.' },
                  { title: 'Professionally Detailed', desc: 'Sanitized and polished before every handover.' }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <div className="h-5 w-5 rounded-full bg-[#FDB813] flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white " />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">{feature.title}</h4>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rental Terms */}
            <div className="space-y-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Rental Terms</h2>
              <div className="bg-[#F4F3F5] border border-slate-100 rounded-[2rem] overflow-hidden">
                {[
                  { label: 'Daily Mileage', value: '200km included' },
                  { label: 'Fuel Policy', value: 'Full-to-Full' },
                  { label: 'Pickup & Delivery', value: 'Free Ilorin Delivery' }
                ].map((term, i) => (
                  <div key={i} className="flex items-center justify-between px-8 py-6 border-b border-slate-200/50 last:border-none">
                    <span className="text-slate-500 text-sm font-medium">{term.label}</span>
                    <span className="text-slate-900 text-sm font-bold">{term.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4">
            <HireDetailSidebar car={car} onBookNow={handleBookNow} />
          </div>
        </div>

        {/* Similar Hire Cars Section */}
        <div className="space-y-8 pt-12  border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-[#1A2B3D] tracking-tight">Similar Vehicles in Ilorin</h2>
            <Link to="/car-hire/all" className="text-primary font-bold text-xs flex items-center gap-2 hover:gap-3 transition-all uppercase tracking-widest">
              View Entire Showroom <span className="text-xl">→</span>
            </Link>
          </div>

          {isSimilarLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(3).fill(0).map((_, i) => <CarCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarCars.length > 0 ? (
                similarCars.slice(0, 3).map(car => (
                  <RentalCarMiniCard key={car._id} car={car} />
                ))
              ) : (
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No similar vehicles found at the moment.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {car && (
        <HireCheckoutModal
          isOpen={isCheckoutOpen}
          initialData={bookingData}
          onClose={() => setIsCheckoutOpen(false)}
          car={car}
        />
      )}
    </div>
  );
};

export default CarRentalDetails;
