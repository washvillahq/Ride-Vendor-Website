import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useCars, useCreateCar } from '../../features/cars/hooks';
import { PageHeader } from '../../components/shared/Headers';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/ui/StatusBadge';

const carSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().min(4, 'Valid year required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Description is too short'),
  type: z.enum(['rental', 'sale']),
  category: z.string().min(1, 'Category is required'),
  rentalPrice: z.string().optional(),
  salePrice: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL'),
}).refine((data) => {
  if (data.type === 'rental' && !data.rentalPrice) return false;
  if (data.type === 'sale' && !data.salePrice) return false;
  return true;
}, {
  message: 'Price is required for the selected type',
  path: ['rentalPrice'], // Simplification: path can only be one
});

const AdminCars = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useCars({ limit: 50 });
  const { mutateAsync: createCar, isLoading: isSubmitting } = useCreateCar();
  
  const cars = data?.data?.cars || [];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(carSchema),
    defaultValues: { type: 'rental' }
  });

  const carType = watch('type');

  const onSubmit = async (data) => {
    try {
      // API expects image URL in an array of objects
      const payload = {
        ...data,
        images: [{ url: data.imageUrl, public_id: 'initial_upload' }],
        rentalPrice: data.rentalPrice ? Number(data.rentalPrice) : undefined,
        salePrice: data.salePrice ? Number(data.salePrice) : undefined,
        year: Number(data.year),
      };
      delete payload.imageUrl;
      
      await createCar(payload);
      toast.success('Car created successfully!');
      setIsModalOpen(false);
      reset();
    } catch (err) {
      // Error handled globally
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Fleet Management" 
        description="Add, edit, and monitor all vehicles in the RideVendor network."
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add New Car
          </Button>
        }
      />

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : cars.length > 0 ? (
        <div className="bg-white border rounded-[2rem] overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Car Details</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.map((car) => (
                <TableRow key={car._id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-16 rounded-xl bg-slate-100 overflow-hidden border shrink-0">
                        <img src={car.images[0]?.url} className="h-full w-full object-cover" alt={car.name} />
                      </div>
                      <div>
                         <p className="font-black text-slate-900 leading-tight">{car.name}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{car.brand} · {car.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={car.type === 'rental' ? 'secondary' : 'default'} className="uppercase">
                      {car.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold">
                    ${car.type === 'rental' ? `${car.rentalPrice}/day` : car.salePrice?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">{car.location}</TableCell>
                  <TableCell><StatusBadge status={car.status} /></TableCell>
                  <TableCell className="text-right">
                    <button className="p-2 text-slate-400 hover:text-black">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00-2 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : !isLoading ? (
        <EmptyState title="No cars found" description="You haven't added any cars to the fleet yet." />
      ) : (
        <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading Fleet...</div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Vehicle"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4 px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input label="Vehicle Name" placeholder="e.g. Tesla Model S Plaid" {...register('name')} error={errors.name} />
             <div className="grid grid-cols-2 gap-4">
                <Input label="Brand" placeholder="e.g. Tesla" {...register('brand')} error={errors.brand} />
                <Input label="Model" placeholder="e.g. Model S" {...register('model')} error={errors.model} />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Input label="Year" placeholder="2024" {...register('year')} error={errors.year} />
             <Select 
                label="Category"
                options={[
                  { value: 'Sedan', label: 'Sedan' },
                  { value: 'SUV', label: 'SUV' },
                  { value: 'Luxury', label: 'Luxury' },
                  { value: 'Sports', label: 'Sports' },
                ]}
                {...register('category')}
                error={errors.category}
             />
             <Input label="Location" placeholder="Lagos, Nigeria" {...register('location')} error={errors.location} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border">
             <Select 
                label="Listing Type"
                options={[
                  { value: 'rental', label: 'For Rent' },
                  { value: 'sale', label: 'For Sale' },
                ]}
                {...register('type')}
                error={errors.type}
             />
             {carType === 'rental' ? (
                <Input label="Rental Price (per day)" icon={<span className="text-slate-400">$</span>} type="number" {...register('rentalPrice')} error={errors.rentalPrice} />
             ) : (
                <Input label="Sale Price (Total)" icon={<span className="text-slate-400">$</span>} type="number" {...register('salePrice')} error={errors.salePrice} />
             )}
          </div>

          <Input label="Image URL" placeholder="https://..." {...register('imageUrl')} error={errors.imageUrl} />
          
          <div className="space-y-1">
             <label className="text-sm font-bold text-slate-700">Description</label>
             <textarea 
               className="w-full min-h-[120px] p-4 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-black outline-none text-sm"
               placeholder="Detailed vehicle specifications, history, and features..."
               {...register('description')}
             />
             {errors.description && <p className="text-xs text-red-500 font-bold">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
             <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
             <Button type="submit" isLoading={isSubmitting} className="px-8">Create Vehicle</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCars;
