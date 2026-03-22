import React from 'react';
import { useCars } from '../features/cars/hooks';
import RentalHero from '../features/cars/components/RentalHero';
import RentalCategoryCard from '../features/cars/components/RentalCategoryCard';
import RentalCarCard from '../features/cars/components/RentalCarCard';
import CarCardSkeleton from '../features/cars/components/CarCardSkeleton';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CarRentals = () => {
  const { data, isLoading } = useCars({ type: 'rental', limit: 6 });
  const cars = data?.data?.cars || [];

  const categories = [
    {
      title: "Executive & VIP",
      description: "Arrive in elite style and comfort.",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Corporate & Staff",
      description: "Reliable transit for professionals.",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Wedding Specials",
      description: "Elegant vehicles for your big day.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Daily & Airport",
      description: "Affordable and fast urban mobility.",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container px-4 py-8 space-y-12">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Services', link: '/services' },
            { label: 'Car Hire & Rentals' }
          ]} 
        />

        {/* Hero Section */}
        <RentalHero />

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <RentalCategoryCard 
              key={i}
              title={cat.title}
              description={cat.description}
              image={cat.image}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>

        {/* Available Fleet Section */}
        <div className="space-y-8 pt-8">
          <div className="flex items-end justify-between border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 leading-tight">Available Fleet</h2>
              <p className="text-slate-500 text-sm font-medium">Discover our curated selection of high-performance rentals.</p>
            </div>
            <Link to="/cars?type=rental" className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] group hover:text-accent transition-colors">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(3).fill(0).map((_, i) => <CarCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map(car => (
                <RentalCarCard key={car._id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarRentals;
