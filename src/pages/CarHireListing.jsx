import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCars } from '../features/cars/hooks';
import SidebarFilters from '../features/cars/components/SidebarFilters';
import CarCardSkeleton from '../features/cars/components/CarCardSkeleton';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/feedback/ErrorState';
import Button from '../components/ui/Button';
import RentalSearchBar from '../features/cars/components/RentalSearchBar';
import RentalCarCard from '../features/cars/components/RentalCarCard';

const CarHireListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');

  // Extract filters from URL
  const filters = useMemo(() => ({
    type: 'rental',
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

  const handleSearchSubmit = (searchData) => {
    if (!searchData) return;

    const updates = {
      serviceCategory: searchData.category === 'Select Category' ? '' : searchData.category,
      // Add more mappings if needed, e.g. pickup point if the API supports it
    };

    handleBulkFilterChange(updates);
  };
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container px-4 py-10 space-y-16">
        {/* Breadcrumbs & Modern Search Section */}
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <Breadcrumbs
              items={[
                // { label: 'Services', link: '/services' },
                { label: 'Car Hire', link: '/car-hire' },
                { label: 'All Vehicles' }
              ]}
            />
            <div className="hidden md:flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#1A2B3D]">Live Fleet Status</span>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-slate-100/50 rounded-[4rem] blur-2xl group-hover:bg-slate-200/50 transition-all duration-700" />
            <div className="relative">
              <RentalSearchBar onSearch={handleSearchSubmit} />
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-12">
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FDB813]">Ilorin Region</p>
            <h1 className="text-xl md:text-5xl font-medium text-[#1A2B3D] tracking-tighter">
              {isLoading ? 'Scanning Assets...' : `Showing ${data?.data?.pagination?.total || 0} available rides in ilorin`}
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-lg">Curated premium vehicles ready for immediate deployment.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort By</p>
              <select
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="text-sm font-black text-[#1A2B3D] bg-transparent border-none focus:ring-0 cursor-pointer"
              >
                <option value="-createdAt">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <SidebarFilters
                filters={filters}
                onFilterChange={handleBulkFilterChange}
                onApply={() => refetch()}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-12">
            {isError ? (
              <ErrorState onRetry={refetch} />
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => <CarCardSkeleton key={i} />)}
              </div>
            ) : cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cars.map(car => (
                    <RentalCarCard key={car._id} car={car} />
                  ))}
                </div>
                {pagination.totalPages > 1 && (
                  <div className="mt-20 pt-12 border-t border-slate-50 flex justify-center">
                    <Pagination
                      currentPage={filters.page}
                      totalPages={pagination.totalPages}
                      onPageChange={(page) => handleFilterChange('page', page)}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="pt-20">
                <EmptyState
                  title="No matching rides found"
                  description="We couldn't find any vehicles matching your current filters. Try relaxing your criteria or search for a different car type."
                  action={
                    <button
                      onClick={() => setSearchParams({ type: 'rental' })}
                      className="px-10 py-4 bg-[#1A2B3D] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
                    >
                      Reset Discovery
                    </button>
                  }
                />
              </div>
            )}

            {/* Trust Section */}
            {!isLoading && cars.length > 0 && (
              <div className="bg-slate-50 rounded-[2.5rem] p-10 mt-20 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-100">
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-[#1A2B3D]">Secure Booking Guarantee</h4>
                  <p className="text-slate-500 font-medium text-sm">All vehicles are inspected and verified by RideVendor agents.</p>
                </div>
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                    </div>
                  ))}
                  <div className="h-12 w-12 rounded-full border-4 border-white bg-[#FDB813] flex items-center justify-center text-[10px] font-black text-[#1A2B3D]">
                    +2k
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarHireListing;
