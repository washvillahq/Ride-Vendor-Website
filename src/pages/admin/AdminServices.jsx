import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useServices, useCreateService } from '../../features/services/hooks';
import { PageHeader } from '../../components/shared/Headers';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Checkbox from '../../components/ui/Checkbox';

const serviceSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(5, 'Description is too short'),
  price: z.string().min(1, 'Price is required'),
  applicableTo: z.array(z.string()).min(1, 'Select at least one category'),
});

const AdminServices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useServices();
  const { mutateAsync: createService, isLoading: isSubmitting } = useCreateService();
  
  const services = data?.data?.services || [];
  const categories = ['Sedan', 'SUV', 'Luxury', 'Sports', 'Truck', 'Van'];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: { applicableTo: [] }
  });

  const onSubmit = async (data) => {
    try {
      await createService({
        ...data,
        price: Number(data.price)
      });
      toast.success('Service created successfully!');
      setIsModalOpen(false);
      reset();
    } catch (err) {
      // Handled globally
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Extra Services" 
        description="Configure add-on services like Insurance, GPS, and Chauffeurs for rentals."
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Service
          </Button>
        }
      />

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : services.length > 0 ? (
        <div className="bg-white border rounded-[2rem] overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Applicable Categories</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell className="font-black text-slate-900">{service.name}</TableCell>
                  <TableCell className="text-slate-500 text-sm max-w-xs truncate">{service.description}</TableCell>
                  <TableCell className="font-bold">${service.price}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {service.applicableTo.map(cat => (
                        <Badge key={cat} variant="outline" className="text-[10px] uppercase font-bold">{cat}</Badge>
                      ))}
                    </div>
                  </TableCell>
                   <TableCell className="text-right">
                    <button className="text-red-500 hover:text-red-700 font-bold text-xs uppercase transition-colors">Delete</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : !isLoading ? (
        <EmptyState title="No services configured" description="Add your first rental service to get started." />
      ) : (
        <div className="p-12 text-center text-slate-400 font-bold animate-pulse uppercase tracking-widest">Loading Services...</div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Service"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <Input label="Service Name" placeholder="e.g. Comprehensive Insurance" {...register('name')} error={errors.name} />
          
          <div className="space-y-1">
             <label className="text-sm font-bold text-slate-700 leading-none">Description</label>
             <textarea 
               className="w-full min-h-[80px] p-4 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-black outline-none text-sm"
               placeholder="What does this service include?"
               {...register('description')}
             />
             {errors.description && <p className="text-xs text-red-500 font-bold">{errors.description.message}</p>}
          </div>

          <Input label="Price ($)" type="number" {...register('price')} error={errors.price} />

          <div className="space-y-3">
             <label className="text-sm font-bold text-slate-700 leading-none">Applicable Car Categories</label>
             <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border">
                {categories.map(cat => (
                  <Checkbox 
                    key={cat}
                    label={cat}
                    value={cat}
                    {...register('applicableTo')}
                    className="text-xs font-bold"
                  />
                ))}
             </div>
             {errors.applicableTo && <p className="text-xs text-red-500 font-bold">{errors.applicableTo.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
             <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
             <Button type="submit" isLoading={isSubmitting}>Create Service</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminServices;
