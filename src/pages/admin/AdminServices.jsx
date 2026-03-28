import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useServices, useCreateService, useUpdateService, useDeleteService } from '../../features/services/hooks';
import { PageHeader } from '../../components/shared/Headers';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Checkbox from '../../components/ui/Checkbox';
import { cn } from '../../utils/cn';
import {
  DollarSign,
  Plus,
  Edit3,
  Trash2,
  Search
} from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';

const serviceSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(5, 'Description is too short'),
  price: z.string().min(1, 'Price is required'),
  applicableTo: z.array(z.string()).min(1, 'Select at least one category'),
});

const AdminServices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const { data, isLoading, isError, refetch } = useServices();
  const { mutateAsync: createService, isLoading: isCreating } = useCreateService();
  const { mutateAsync: updateService, isLoading: isUpdating } = useUpdateService();
  const { mutateAsync: deleteService } = useDeleteService();

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

  const handleEdit = (service) => {
    setEditingService(service);
    reset({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      applicableTo: service.applicableTo,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        toast.success('Service deleted successfully');
      } catch (err) { }
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        price: Number(data.price)
      };

      if (editingService) {
        await updateService({ id: editingService._id, data: payload });
        toast.success('Service updated successfully!');
      } else {
        await createService(payload);
        toast.success('Service created successfully!');
      }

      setIsModalOpen(false);
      setEditingService(null);
      reset();
    } catch (err) { }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-medium text-slate-900 tracking-tight">Extra Services</h1>
          <p className="text-slate-500 mt-1 font-medium">Configure add-on services like Insurance, GPS, and Chauffeurs.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Search services..."
              className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-black outline-none transition-all w-64 shadow-sm"
            />
          </div>
          <Button
            className="rounded-2xl px-6 py-6 shadow-lg shadow-slate-900/10"
            onClick={() => {
              setEditingService(null);
              reset({ applicableTo: [] });
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Define Service
          </Button>
        </div>
      </section>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : services.length > 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="py-5 px-8 font-medium uppercase tracking-widest text-[10px]">Service Identity</TableHead>
                <TableHead className="py-5 font-medium uppercase tracking-widest text-[10px]">Registry Cost</TableHead>
                <TableHead className="py-5 font-medium uppercase tracking-widest text-[10px]">Applicable Scope</TableHead>
                <TableHead className="py-5 px-8 font-medium uppercase tracking-widest text-[10px] text-right">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service._id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-medium text-xs shadow-lg shadow-slate-900/10">
                        {service.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 leading-none text-base">{service.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest line-clamp-1 max-w-xs">{service.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 text-base">₦{service.price?.toLocaleString()}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Base Rate</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex flex-wrap gap-1.5">
                      {service.applicableTo.map(cat => (
                        <Badge key={cat} className="text-[9px] uppercase font-medium tracking-widest px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg">{cat}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-8 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2.5 bg-white text-slate-600 hover:text-black border border-slate-100 hover:border-slate-300 shadow-sm rounded-xl transition-all"
                        title="Modify Record"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="p-2.5 bg-white text-slate-400 hover:text-red-500 border border-slate-100 hover:border-red-100 shadow-sm rounded-xl transition-all"
                        title="Archive Service"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : !isLoading ? (
        <EmptyState title="No services configured" description="Add your first rental service to get started." />
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="py-5 px-8 font-medium uppercase tracking-widest text-[10px]">Service Identity</TableHead>
                <TableHead className="py-5 font-medium uppercase tracking-widest text-[10px]">Registry Cost</TableHead>
                <TableHead className="py-5 font-medium uppercase tracking-widest text-[10px]">Applicable Scope</TableHead>
                <TableHead className="py-5 px-8 font-medium uppercase tracking-widest text-[10px] text-right">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="py-6 px-8" colSpan={4}>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-2xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Create New Service'}
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

          <Input label="Price (₦)" type="number" {...register('price')} error={errors.price} />

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
            <Button type="submit" isLoading={isSubmitting}>
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminServices;
