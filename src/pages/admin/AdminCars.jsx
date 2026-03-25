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
  plateNumber: z.string().optional(),
  climateControl: z.boolean().optional(),
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
      plateNumber: car.plateNumber || '',
      climateControl: car.climateControl ?? true,
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
        title={editingCar ? 'Update Fleet Record' : 'Provision New Vehicle'}
        maxWidth="6xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 pb-12">
          {/* Section 1: Core Identity */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                  <Car className="w-5 h-5 text-slate-500" />
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Core Vehicle Identity</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Primary registration details</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
               <div className="md:col-span-8">
                  <Input 
                    label="Master Vehicle Title" 
                    placeholder="e.g. 2024 Mercedes-Benz G63 AMG" 
                    {...register('title')} 
                    error={errors.title} 
                    className="py-4"
                  />
               </div>
               <div className="md:col-span-4">
                  <Input 
                    label="Year of Registry" 
                    placeholder="2024" 
                    {...register('year')} 
                    error={errors.year} 
                    className="py-4 text-center font-black"
                  />
               </div>
               <div className="md:col-span-4">
                  <Input 
                    label="Brand Name" 
                    placeholder="e.g. Mercedes-Benz" 
                    {...register('brand')} 
                    error={errors.brand} 
                    className="py-4"
                  />
               </div>
               <div className="md:col-span-4">
                  <Input 
                    label="Model Designation" 
                    placeholder="e.g. G63 AMG" 
                    {...register('model')} 
                    error={errors.model} 
                    className="py-4"
                  />
               </div>
               <div className="md:col-span-4">
                  <Input 
                    label="Plate Registry Number" 
                    placeholder="ABJ-001-HQ" 
                    {...register('plateNumber')} 
                    error={errors.plateNumber} 
                    className="py-4 font-mono font-bold"
                  />
               </div>
            </div>
          </div>

          {/* Section 2: Regional & Service Operational Details */}
          <div className="space-y-8 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                  <MapPin className="w-5 h-5 text-blue-500" />
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Regional Operations</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Location and service categorization</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Select 
                    label="Current Deployment Hub"
                    options={[
                        { value: 'Lagos', label: 'Lagos Island' },
                        { value: 'Abuja', label: 'Abuja Central' },
                        { value: 'Port Harcourt', label: 'PH Garden City' },
                        { value: 'Ilorin', label: 'Ilorin Hub' },
                    ]}
                    {...register('location')}
                    error={errors.location}
                    className="py-4"
                />
                <Select 
                    label="Vehicle Classification"
                    options={CAR_TYPES.map(t => ({ value: t, label: t }))}
                    {...register('category')}
                    error={errors.category}
                    className="py-4"
                />
                <Select 
                    label="Elite Service Alignment"
                    options={[
                    { value: '', label: 'No Specific Alignment' },
                    ...SERVICE_CATEGORIES.map(t => ({ value: t, label: t }))
                    ]}
                    {...register('serviceCategory')}
                    error={errors.serviceCategory}
                    className="py-4"
                />
            </div>
          </div>

          {/* Section 3: Technical DNA */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
                  <Settings className="w-5 h-5 text-emerald-500" />
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Technical DNA</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Engineering and mechanical data</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Input label="Total Odometer (KM)" type="number" placeholder="42000" {...register('mileage')} error={errors.mileage} className="py-4" />
                <Input label="Engine Config" placeholder="e.g. 4.0L Bi-Turbo V8" {...register('engine')} error={errors.engine} className="py-4" />
                <Select 
                    label="Drive System"
                    options={CAR_TRANSMISSIONS.map(t => ({ value: t, label: t }))}
                    {...register('transmission')}
                    error={errors.transmission}
                    className="py-4"
                />
                <Select 
                    label="Primary Fuel Source"
                    options={CAR_FUEL_TYPES.map(t => ({ value: t, label: t }))}
                    {...register('fuelType')}
                    error={errors.fuelType}
                    className="py-4"
                />
                <Input label="Exterior Color" placeholder="Diamond White" {...register('color')} error={errors.color} className="py-4" />
                <Select 
                    label="Market Condition"
                    options={CAR_CONDITIONS.map(c => ({ value: c, label: c }))}
                    {...register('condition')}
                    error={errors.condition}
                    className="py-4"
                />
                <Input label="Cargo Units" type="number" placeholder="4" {...register('suitcases')} error={errors.suitcases} className="py-4" />
                
                <div className="flex flex-col gap-2 justify-end pb-1 px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Environment Control</label>
                    <div className="flex items-center gap-4 h-[60px] bg-slate-50 border border-slate-100 rounded-2xl px-6">
                        <input 
                            type="checkbox" 
                            className="h-5 w-5 rounded-lg border-slate-300 text-black focus:ring-black transition-all cursor-pointer" 
                            {...register('climateControl')} 
                            id="climate"
                        />
                        <label htmlFor="climate" className="text-sm font-black text-slate-700 cursor-pointer">Climate Control Active</label>
                    </div>
                </div>
            </div>
          </div>

          {/* Section 4: Commercial Configuration */}
          <div className="space-y-8 bg-[#1A2B3D] p-10 rounded-[3rem] border border-black shadow-2xl shadow-blue-900/10 text-white">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Tag className="w-5 h-5 text-accent" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Commercial Configuration</h3>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] mt-0.5">Listing type and pricing architecture</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Market Strategy</label>
                    <div className="grid grid-cols-2 gap-4">
                        {['rental', 'sale'].map((type) => (
                           <label 
                            key={type}
                            className={cn(
                                "flex items-center justify-center py-5 px-6 rounded-2xl border-2 transition-all cursor-pointer font-black text-xs uppercase tracking-widest",
                                carType === type 
                                ? "bg-accent border-accent text-[#1A2B3D] shadow-[0_0_20px_rgba(253,184,19,0.2)]" 
                                : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                            )}
                           >
                              <input type="radio" value={type} {...register('type')} className="hidden" />
                              {type === 'rental' ? 'Fleet Hire' : 'Unit Sale'}
                           </label>
                        ))}
                    </div>
                </div>
                
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Valuation Agreement (₦)</label>
                    {carType === 'rental' ? (
                        <div className="relative">
                           <span className="absolute left-6 top-1/2 -translate-y-1/2 text-accent font-black text-lg">₦</span>
                           <input 
                            type="number"
                            {...register('pricePerDay')}
                            placeholder="Daily Hire Rate"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-5 text-xl font-black focus:ring-2 focus:ring-accent outline-none transition-all"
                           />
                           <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/30 uppercase tracking-widest">/ Day</span>
                        </div>
                    ) : (
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-accent font-black text-lg">₦</span>
                            <input 
                             type="number"
                             {...register('salePrice')}
                             placeholder="Asset Base Price"
                             className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-5 text-xl font-black focus:ring-2 focus:ring-accent outline-none transition-all"
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/30 uppercase tracking-widest">Final</span>
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* Section 5: Intelligence & Media */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
             <div className="md:col-span-12 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100 shadow-sm">
                        <FileText className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Intelligence & Narrative</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Asset description and condition reporting</p>
                    </div>
                </div>
                
                <textarea 
                    className="w-full min-h-[160px] p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] focus:ring-2 focus:ring-black outline-none text-base font-medium leading-relaxed"
                    placeholder="Provide a comprehensive narrative about this vehicle, including history, detailed specs, and premium features..."
                    {...register('description')}
                />
                {errors.description && <p className="text-xs text-red-500 font-bold px-4">{errors.description.message}</p>}
             </div>

             <div className="md:col-span-12 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Visual Documentation</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">High-fidelity asset photography</p>
                    </div>
                </div>

                {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
                    {imagePreviews.map((url, index) => {
                        const isExisting = index < (editingCar?.images?.length || 0);
                        const imageId = isExisting ? editingCar.images[index]._id : null;
                        
                        return (
                            <div key={index} className="relative aspect-[4/3] rounded-3xl overflow-hidden group border border-slate-100 bg-white shadow-sm ring-4 ring-white">
                                <img src={url} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`Preview ${index}`} />
                                <button 
                                    type="button"
                                    onClick={() => isExisting ? handleRemoveExistingImage(imageId) : removeImage(index)}
                                    className="absolute inset-0 bg-red-600/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                                >
                                    <Trash2 className="w-8 h-8 text-white scale-75 group-hover:scale-100 transition-transform" />
                                </button>
                                {isExisting && (
                                    <div className="absolute top-3 right-3 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg shadow-emerald-500/50" />
                                )}
                            </div>
                        );
                    })}
                    </div>
                )}

                <div className="group relative flex flex-col items-center justify-center p-12 bg-white border-4 border-dashed border-slate-100 rounded-[3rem] hover:border-accent hover:bg-slate-50/50 transition-all duration-500 text-center">
                    <div className="h-20 w-24 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Plus className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-lg font-black text-slate-900">Deploy Assets</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tap to select or drag vehicles photos</p>
                    </div>
                    
                    <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                </div>
             </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-12 border-t border-slate-100">
             <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-black transition-colors"
                disabled={isSubmitting}
             >
                Cancel Provision
             </button>
             <Button 
                type="submit" 
                isLoading={isSubmitting} 
                className="w-full sm:w-auto px-16 py-8 rounded-[2rem] shadow-2xl shadow-primary/20 text-sm font-black uppercase tracking-[0.2em]"
             >
                {editingCar ? 'Commit Changes' : 'Execute Provision'}
             </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCars;
