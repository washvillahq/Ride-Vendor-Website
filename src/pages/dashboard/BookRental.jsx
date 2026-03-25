import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCars } from '../../features/cars/hooks';
import SidebarFilters from '../../features/cars/components/SidebarFilters';
import RentalCarCard from '../../features/cars/components/RentalCarCard';
import CarCardSkeleton from '../../features/cars/components/CarCardSkeleton';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import RentalSearchBar from '../../features/cars/components/RentalSearchBar';
import { Sparkles } from 'lucide-react';

const BookRental = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filters = useMemo(() => ({
    type: 'rental',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bodyType: searchParams.get('bodyType') || '',
    transmission: searchParams.get('transmission') || '',
    searchTerm: searchParams.get('searchTerm') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 9,
  }), [searchParams]);

  const { data, isLoading, isError, refetch } = useCars(filters);
  const cars = data?.data?.cars || [];
  const pagination = data?.data?.pagination || { totalPages: 1 };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleBulkFilterChange = (newFilters) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (searchData) => {
     handleBulkFilterChange({
       category: searchData.category === 'Select Category' ? '' : searchData.category,
       // Additional fields can be mapped here if backend supports them
     });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
             <div className="h-6 w-6 rounded-lg bg-amber-50 flex items-center justify-center">
                <Sparkles size={14} className="text-amber-500" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Premium Fleet</span>
          </div>
          <h1 className="text-4xl font-black text-[#1A2B3D] tracking-tighter">Book a Ride</h1>
          <p className="text-slate-500 font-medium tracking-tight">Discover and reserve high-performance vehicles across Ilorin.</p>
        </div>
      </div>

      {/* Hero Search */}
      <div className="relative group">
         <div className="absolute -inset-4 bg-slate-100/50 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
         <div className="relative">
            <RentalSearchBar onSearch={handleSearchSubmit} />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-1">
          <SidebarFilters 
            filters={filters} 
            onFilterChange={handleBulkFilterChange}
            onApply={() => refetch()}
          />
        </aside>

        {/* Results Grid */}
        <main className="lg:col-span-3 space-y-10">
          <div className="flex items-center justify-between border-b border-slate-50 pb-6">
             <p className="text-sm font-black text-[#1A2B3D]">
                {isLoading ? 'Searching...' : `${data?.data?.pagination?.total || 0} Vehicles Found`}
             </p>
             <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort:</span>
                <select 
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="text-xs font-black text-[#1A2B3D] bg-transparent border-none focus:ring-0 cursor-pointer"
                >
                  <option value="-createdAt">Newest</option>
                  <option value="price">Price Low</option>
                  <option value="-price">Price High</option>
                </select>
             </div>
          </div>

          {isError ? (
            <ErrorState onRetry={refetch} />
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                <div className="flex justify-center pt-10">
                   <Pagination 
                     currentPage={filters.page} 
                     totalPages={pagination.totalPages} 
                     onPageChange={(p) => handleFilterChange('page', p)}
                   />
                </div>
              )}
            </>
          ) : (
            <div className="py-20">
              <EmptyState 
                title="No rides available" 
                description="Try adjusting your filters to find your perfect vehicle."
                action={
                  <button onClick={() => setSearchParams({ type: 'rental' })} className="px-8 py-3 bg-[#1A2B3D] text-white rounded-xl font-black text-xs uppercase tracking-widest">Clear All</button>
                }
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BookRental;
