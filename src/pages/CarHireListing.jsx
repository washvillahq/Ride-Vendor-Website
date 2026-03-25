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
      <div className="container px-4 py-8 space-y-12">
        {/* Breadcrumbs & Search Section */}
        <div className="space-y-8">
          <Breadcrumbs
            items={[
              { label: 'Services', link: '/services' },
              { label: 'Car Hire', link: '/car-hire' },
              { label: 'All Vehicles' }
            ]}
          />
          <RentalSearchBar onSearch={handleSearchSubmit} />
        </div>

        {/* Results Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-medium text-slate-900 tracking-tight">
            Showing {isLoading ? '...' : data?.data?.pagination?.total || 0} available rides in Ilorin
          </h1>
          <p className="text-slate-500 font-medium"> Premium curated vehicles for your next journey.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <SidebarFilters
              filters={filters}
              onFilterChange={handleBulkFilterChange}
              onApply={() => refetch()}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-10">
            {/* Car Grid */}
            {isError ? (
              <ErrorState onRetry={refetch} />
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => <CarCardSkeleton key={i} />)}
              </div>
            ) : cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {cars.map(car => (
                    <RentalCarCard key={car._id} car={car} />
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
                title="No rental vehicles found"
                description="Try adjusting your filters or search term to find the perfect rental car."
                action={
                  <Button variant="outline" onClick={() => setSearchParams({ type: 'rental' })}>
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

export default CarHireListing;
