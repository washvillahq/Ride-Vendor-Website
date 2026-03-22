import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCars } from '../features/cars/hooks';
import CarCard from '../features/cars/components/CarCard';
import RentalCarCard from '../features/cars/components/RentalCarCard';
import CarCardSkeleton from '../features/cars/components/CarCardSkeleton';
import { PageHeader } from '../components/shared/Headers';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/feedback/ErrorState';
import Button from '../components/ui/Button';

const FilterBar = ({ filters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange('searchTerm', searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const categories = [
    { value: 'SUV', label: 'SUV' },
    { value: 'Sedan', label: 'Sedan' },
    { value: 'Luxury', label: 'Luxury' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Truck', label: 'Truck' },
    { value: 'Van', label: 'Van' },
  ];

  const types = [
    { value: 'rental', label: 'Rental' },
    { value: 'sale', label: 'For Sale' },
  ];

  const sorts = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'year', label: 'Year: Old to New' },
    { value: '-year', label: 'Year: New to Old' },
  ];

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm mb-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input 
            placeholder="Search by name, brand or model..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-50 border-none shadow-none focus-visible:ring-black"
          />
        </div>
        <Select 
          placeholder="Category"
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          options={categories}
          className="bg-slate-50 border-none"
        />
        <Select 
          placeholder="Car Type"
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          options={types}
          className="bg-slate-50 border-none"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Input 
            placeholder="Location..." 
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="h-9 text-xs max-w-[200px]"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase shrink-0">Sort By</span>
          <Select 
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            options={sorts}
            className="h-9 text-xs py-0 min-w-[150px]"
          />
        </div>
      </div>
    </div>
  );
};

const CarsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Extract filters from URL
  const filters = useMemo(() => ({
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    searchTerm: searchParams.get('searchTerm') || '',
    location: searchParams.get('location') || '',
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
    // Reset to page 1 on filter change
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="container py-8 md:py-12 min-h-screen">
      <PageHeader 
        title="Explore Vehicles" 
        description={`Found ${data?.data?.total || 0} cars matching your criteria.`}
      />

      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => <CarCardSkeleton key={i} />)}
        </div>
      ) : cars.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map(car => (
              car.type === 'rental' 
                ? <RentalCarCard key={car._id} car={car} />
                : <CarCard key={car._id} car={car} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
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
            <Button variant="outline" onClick={() => setSearchParams({})}>
              Reset All Filters
            </Button>
          }
        />
      )}
    </div>
  );
};

export default CarsList;
