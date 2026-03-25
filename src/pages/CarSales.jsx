import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCars } from '../features/cars/hooks';
import SidebarFilters from '../features/cars/components/SidebarFilters';
import DetailedCarCard from '../features/cars/components/DetailedCarCard';
import CarCardSkeleton from '../features/cars/components/CarCardSkeleton';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/feedback/ErrorState';
import Button from '../components/ui/Button';
import { Search, Car, ShieldCheck, ChevronDown } from 'lucide-react';

const CarSales = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');

  // Extract filters from URL
  const filters = useMemo(() => ({
    type: 'sale',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bodyType: searchParams.get('bodyType') || '',
    transmission: searchParams.get('transmission') || '',
    color: searchParams.get('color') || '',
    condition: searchParams.get('condition') || '',
    serviceCategory: searchParams.get('serviceCategory') || '',
    fuelType: searchParams.get('fuelType') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    minMileage: searchParams.get('minMileage') || '',
    maxMileage: searchParams.get('maxMileage') || '',
    minSeats: searchParams.get('minSeats') || '',
    searchTerm: searchParams.get('searchTerm') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 12,
  }), [searchParams]);

  const { data, isLoading, isError, refetch } = useCars(filters);
  const cars = data?.data?.cars || [];
  const pagination = data?.data?.pagination || { totalPages: 1 };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleBulkFilterChange = (newFilters) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleBulkFilterChange({ searchTerm });
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      <div className="container px-4 py-8 space-y-8">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <Breadcrumbs
            items={[
              // { label: 'Services', link: '/services' },
              { label: 'Car Sales' }
            ]}
          />

          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search by brand, model, or year..."
              className="w-full bg-white border border-slate-100 rounded-full pl-14 pr-6 py-4 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-accent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <SidebarFilters
              filters={filters}
              onFilterChange={handleBulkFilterChange}
              onApply={() => refetch()}
              maxPriceLimit={100000000} // 100 Million for car sales
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-10">
            {/* CTA Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative overflow-hidden bg-primary text-white p-10 rounded-[2.5rem] group cursor-pointer hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 min-h-[160px] flex flex-col justify-center">
                <div className="relative z-10 space-y-2">
                  <h3 className="text-2xl font-semibold">Looking to sell?</h3>
                  <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest leading-relaxed max-w-[220px]">
                    List Your Car For a professional listing and secure transaction.
                  </p>
                </div>
                <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:opacity-20 transition-opacity rotate-[-15deg] group-hover:rotate-0 duration-500 scale-150">
                  <Car size={140} strokeWidth={1} />
                </div>
              </div>

              <div className="relative overflow-hidden bg-accent text-primary p-10 rounded-[2.5rem] group cursor-pointer hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 min-h-[160px] flex flex-col justify-center">
                <div className="relative z-10 space-y-2">
                  <h3 className="text-2xl font-semibold">Free Inspection Included</h3>
                  <p className="text-primary/70 text-[10px] font-semibold uppercase tracking-widest leading-relaxed max-w-[220px]">
                    Pre-purchase inspection included with every "Verified" listing.
                  </p>
                </div>
                <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:opacity-20 transition-opacity rotate-[-15deg] group-hover:rotate-0 duration-500 scale-150">
                  <ShieldCheck size={140} strokeWidth={1} />
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <h2 className="text-lg md:text-2xl font-medium text-slate-900">
                Showing {isLoading ? '...' : data?.data?.pagination?.total || 0} Results
              </h2>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Sort By:</span>
                <button className="flex items-center gap-2 bg-white border border-slate-100 px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-widest text-slate-900 group">
                  {filters.sort === '-createdAt' ? 'Newest First' : 'Price: Low to High'}
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-accent transition-colors" />
                </button>
              </div>
            </div>

            {/* Car Grid */}
            {isError ? (
              <ErrorState onRetry={refetch} />
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => <CarCardSkeleton key={i} />)}
              </div>
            ) : cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {cars.map(car => (
                    <DetailedCarCard key={car._id} car={car} />
                  ))}
                </div>
                <div className="mt-16 flex justify-center">
                  <Pagination
                    currentPage={filters.page}
                    totalPages={pagination.totalPages}
                    onPageChange={(page) => handleFilterChange('page', page)}
                  />
                </div>
              </>
            ) : (
              <EmptyState
                title="No vehicles found"
                description="We couldn't find any vehicles matching your current filters. Try resetting or adjusting your search."
                action={
                  <Button variant="outline" onClick={() => setSearchParams({ type: 'sale' })}>
                    Reset All Filters
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarSales;
