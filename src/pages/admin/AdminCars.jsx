import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useCars, useCreateCar, useUpdateCar, useDeleteCar, useUploadCarImage, useDeleteCarImage } from '../../features/cars/hooks';
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
import { cn } from '../../utils/cn';
import { 
  Car, 
  Plus, 
  MapPin, 
  Tag, 
  Settings, 
  Trash2, 
  Edit3, 
  Search,
  CheckCircle2,
  FileText
} from 'lucide-react';

import { 
  CAR_TYPES, 
  CAR_CONDITIONS, 
  CAR_TRANSMISSIONS, 
  CAR_FUEL_TYPES,
  SERVICE_CATEGORIES
} from '../../features/cars/constants';

const carSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().min(4, 'Valid year required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Description is too short'),
  type: z.enum(['rental', 'sale']),
  category: z.string().min(1, 'Category is required'),
  mileage: z.string().optional(),
  engine: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  color: z.string().optional(),
  condition: z.string().optional(),
  seatingCapacity: z.string().optional(),
  doors: z.string().optional(),
  suitcases: z.string().optional(),
  pricePerDay: z.string().optional(),
  salePrice: z.string().optional(),
});

const AdminCars = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data, isLoading, isError, refetch } = useCars({ limit: 50 });
  const { mutateAsync: createCar, isLoading: isCreating } = useCreateCar();
  const { mutateAsync: updateCar, isLoading: isUpdating } = useUpdateCar();
  const { mutateAsync: deleteCar } = useDeleteCar();
  const { mutateAsync: uploadImage, isLoading: isUploading } = useUploadCarImage();
  const { mutateAsync: deleteImage, isLoading: isDeletingImage } = useDeleteCarImage();
  
  const cars = data?.data?.cars || [];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(carSchema),
    defaultValues: { type: 'rental' }
  });

  const carType = watch('type');

  const handleEdit = (car) => {
    setEditingCar(car);
    reset({
      title: car.title,
      brand: car.brand,
      model: car.model,
      year: car.year.toString(),
      location: car.location,
      description: car.description,
      type: car.type,
      category: car.category,
      mileage: car.mileage?.toString(),
      engine: car.engine,
      transmission: car.transmission,
      fuelType: car.fuelType,
      color: car.color,
      condition: car.condition,
      seatingCapacity: car.seatingCapacity?.toString(),
      doors: car.doors?.toString(),
      suitcases: car.suitcases?.toString(),
      pricePerDay: car.pricePerDay?.toString(),
      salePrice: car.salePrice?.toString(),
    });
    setImagePreviews(car.images?.map(img => img.url) || []);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car? it will be set to unavailable.')) {
      try {
        await deleteCar(id);
        toast.success('Car deleted successfully');
      } catch (err) {}
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    // This is for new (locally selected) images
    // We need to account for the offset if there are existing images
    const existingCount = editingCar?.images?.length || 0;
    const actualFileIndex = index - existingCount;
    
    setImageFiles(prev => prev.filter((_, i) => i !== actualFileIndex));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = async (imageId) => {
    if (window.confirm('Delete this image from the server?')) {
      try {
        await deleteImage({ carId: editingCar._id, imageId });
        // After success, we need to update the previews if we're showing them
        // Actually react-query will refetch or we can manually filter
        setImagePreviews(prev => prev.filter(url => !url.includes(imageId)));
        toast.success('Image removed');
      } catch (err) {}
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsProcessing(true);
      const payload = {
        ...data,
        pricePerDay: data.pricePerDay ? Number(data.pricePerDay) : undefined,
        salePrice: data.salePrice ? Number(data.salePrice) : undefined,
        year: Number(data.year),
        mileage: data.mileage ? Number(data.mileage) : undefined,
        seatingCapacity: data.seatingCapacity ? Number(data.seatingCapacity) : undefined,
        doors: data.doors ? Number(data.doors) : undefined,
        suitcases: data.suitcases ? Number(data.suitcases) : undefined,
      };
      
      let carId = editingCar?._id;
      
      if (editingCar) {
        await updateCar({ id: carId, data: payload });
        toast.success('Car updated successfully!');
      } else {
        const response = await createCar(payload);
        carId = response.data._id;
        toast.success('Car details created!');
      }

      // Upload images if new ones are selected
      if (imageFiles.length > 0) {
        const toastId = toast.loading(`Uploading ${imageFiles.length} images...`);
        try {
          for (let i = 0; i < imageFiles.length; i++) {
            toast.loading(`Uploading image ${i + 1}/${imageFiles.length}...`, { id: toastId });
            await uploadImage({ id: carId, file: imageFiles[i] });
          }
          toast.success('All images uploaded successfully!', { id: toastId });
        } catch (uploadErr) {
          toast.error('Failed to upload some images', { id: toastId });
        }
      }

      setIsModalOpen(false);
      setEditingCar(null);
      setImageFiles([]);
      setImagePreviews([]);
      reset();
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isSubmitting = isCreating || isUpdating || isUploading || isProcessing;

  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Fleet Management</h1>
           <p className="text-slate-500 mt-1 font-medium">Add, edit, and monitor all vehicles in the RideVendor network.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black transition-colors" />
              <input 
                type="text" 
                placeholder="Search fleet..." 
                className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-black outline-none transition-all w-64 shadow-sm"
              />
           </div>
           <Button 
            className="rounded-2xl px-6 py-6 shadow-lg shadow-slate-900/10"
            onClick={() => {
              setEditingCar(null);
              reset({ type: 'rental' });
              setImagePreviews([]);
              setImageFiles([]);
              setIsModalOpen(true);
            }}
           >
            <Plus className="w-5 h-5 mr-2" />
            Provision Vehicle
          </Button>
        </div>
      </section>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : cars.length > 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="py-5 px-8 font-black uppercase tracking-widest text-[10px]">Vehicle Identity</TableHead>
                <TableHead className="py-5 font-black uppercase tracking-widest text-[10px]">Registry Type</TableHead>
                <TableHead className="py-5 font-black uppercase tracking-widest text-[10px]">Valuation</TableHead>
                <TableHead className="py-5 font-black uppercase tracking-widest text-[10px]">Coordinates</TableHead>
                <TableHead className="py-5 font-black uppercase tracking-widest text-[10px]">Operational Status</TableHead>
                <TableHead className="py-5 px-8 font-black uppercase tracking-widest text-[10px] text-right">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.map((car) => (
                <TableRow key={car._id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-6 px-8">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-20 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                        {car.images?.[0] ? (
                          <img src={car.images[0].url} className="h-full w-full object-cover" alt={car.title} />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-300"><Car size={24} /></div>
                        )}
                      </div>
                      <div>
                         <p className="font-black text-slate-900 leading-tight text-base">{car.title}</p>
                         <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">{car.brand}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{car.category}</span>
                         </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge 
                      variant={car.type === 'rental' ? 'secondary' : 'default'} 
                      className={cn(
                        "uppercase font-black text-[9px] tracking-widest px-3 py-1 rounded-lg",
                        car.type === 'rental' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                      )}
                    >
                      {car.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex flex-col">
                       <span className="font-black text-slate-900">₦{car.type === 'rental' ? car.pricePerDay?.toLocaleString() : car.salePrice?.toLocaleString()}</span>
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{car.type === 'rental' ? 'Per Calendar Day' : 'Fixed Valuation'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs uppercase tracking-tighter">
                       <MapPin size={12} className="text-slate-300" />
                       {car.location}
                    </div>
                  </TableCell>
                  <TableCell className="py-6"><StatusBadge status={car.status} className="text-[9px] font-black uppercase px-3" /></TableCell>
                  <TableCell className="py-6 px-8 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(car)}
                        className="p-2.5 bg-white text-slate-600 hover:text-black border border-slate-100 hover:border-slate-300 shadow-sm rounded-xl transition-all"
                        title="Modify Record"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                         onClick={() => handleDelete(car._id)}
                         className="p-2.5 bg-white text-slate-400 hover:text-red-500 border border-slate-100 hover:border-red-100 shadow-sm rounded-xl transition-all"
                         title="Archive Vehicle"
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
        <EmptyState title="No cars found" description="You haven't added any cars to the fleet yet." />
      ) : (
        <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading Fleet...</div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4 px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input label="Vehicle Name" placeholder="e.g. Tesla Model S Plaid" {...register('title')} error={errors.title} />
             <div className="grid grid-cols-2 gap-4">
                <Input label="Brand" placeholder="e.g. Tesla" {...register('brand')} error={errors.brand} />
                <Input label="Model" placeholder="e.g. Model S" {...register('model')} error={errors.model} />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Input label="Year" placeholder="2024" {...register('year')} error={errors.year} />
             <Select 
                label="Category"
                options={CAR_TYPES.map(t => ({ value: t, label: t }))}
                {...register('category')}
                error={errors.category}
             />
             <Select 
                label="Service Category (Optional)"
                options={[
                  { value: '', label: 'None' },
                  ...SERVICE_CATEGORIES.map(t => ({ value: t, label: t }))
                ]}
                {...register('serviceCategory')}
                error={errors.serviceCategory}
             />
             <Input label="Location" placeholder="Lagos, Nigeria" {...register('location')} error={errors.location} />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
             <h3 className="text-sm font-black text-slate-900">Vehicle Specifications</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <Input label="Mileage (km)" type="number" placeholder="42000" {...register('mileage')} error={errors.mileage} />
                 <Input label="Engine" placeholder="e.g. 3.5L V6" {...register('engine')} error={errors.engine} />
                 <Select 
                    label="Transmission"
                    options={CAR_TRANSMISSIONS.map(t => ({ value: t, label: t }))}
                    {...register('transmission')}
                    error={errors.transmission}
                 />
                 <Select 
                    label="Fuel Type"
                    options={CAR_FUEL_TYPES.map(t => ({ value: t, label: t }))}
                    {...register('fuelType')}
                    error={errors.fuelType}
                 />
                 <Input label="Color" placeholder="Graphite Gray" {...register('color')} error={errors.color} />
                 <Select 
                    label="Condition"
                    options={CAR_CONDITIONS.map(c => ({ value: c, label: c }))}
                    {...register('condition')}
                    error={errors.condition}
                 />
                 <Input label="Seating Capacity" type="number" placeholder="5" {...register('seatingCapacity')} error={errors.seatingCapacity} />
                 <Input label="Doors" type="number" placeholder="4" {...register('doors')} error={errors.doors} />
                 <Input label="Suitcases" type="number" placeholder="2" {...register('suitcases')} error={errors.suitcases} />
             </div>
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
                <Input label="Rental Price (per day)" icon={<span className="text-slate-400">₦</span>} type="number" {...register('pricePerDay')} error={errors.pricePerDay} />
              ) : (
                <Input label="Sale Price (Total)" icon={<span className="text-slate-400">₦</span>} type="number" {...register('salePrice')} error={errors.salePrice} />
              )}
          </div>

          <div className="space-y-4">
             <label className="text-sm font-bold text-slate-700">Vehicle Images</label>
             
             {/* Preview Grid */}
             {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 p-4 bg-slate-50 border rounded-2xl">
                   {imagePreviews.map((url, index) => {
                      const isExisting = index < (editingCar?.images?.length || 0);
                      const imageId = isExisting ? editingCar.images[index]._id : null;
                      
                      return (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border bg-white">
                           <img src={url} className="h-full w-full object-cover" alt={`Preview ${index}`} />
                           <button 
                              type="button"
                              onClick={() => isExisting ? handleRemoveExistingImage(imageId) : removeImage(index)}
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                           {isExisting && (
                             <div className="absolute top-1 right-1 h-2 w-2 bg-emerald-500 rounded-full border border-white" title="Saved" />
                           )}
                        </div>
                      );
                   })}
                </div>
             )}

             <div className="flex items-center gap-6 p-6 bg-slate-50 border-2 border-dashed rounded-[2rem] hover:border-accent transition-colors">
                <div className="h-16 w-20 rounded-2xl bg-white border flex items-center justify-center text-slate-300">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="flex-1 space-y-1">
                   <p className="text-xs font-black uppercase tracking-widest text-slate-900">Add more photos</p>
                   <p className="text-[10px] text-slate-400 font-medium">Select one or more vehicle photos</p>
                   <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={handleImageChange}
                      className="hidden" 
                      id="car-image-upload" 
                   />
                   <label 
                      htmlFor="car-image-upload"
                      className="inline-block mt-2 px-4 py-2 bg-white border text-[9px] font-black uppercase tracking-widest rounded-xl cursor-pointer hover:bg-black hover:text-white transition-all shadow-sm"
                   >
                      Browse Files
                   </label>
                </div>
             </div>
          </div>
          
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
             <Button type="submit" isLoading={isSubmitting} className="px-8">
                {editingCar ? 'Update Vehicle' : 'Create Vehicle'}
             </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCars;
