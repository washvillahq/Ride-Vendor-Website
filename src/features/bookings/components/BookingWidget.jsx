import React, { useState, useMemo, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';
import { useCheckAvailability, useCreateBooking } from '../hooks';
import { useServices } from '../../services/hooks';
import { useInitializePayment } from '../../payments/hooks';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Card, CardContent } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Checkbox from '../../../components/ui/Checkbox';

const bookingSchema = z.object({
  startDate: z.string().min(1, 'Please select a start date'),
  endDate: z.string().min(1, 'Please select an end date'),
  services: z.array(z.string()).optional().default([]),
}).refine((data) => {
  const start = dayjs(data.startDate);
  const end = dayjs(data.endDate);
  return end.isAfter(start);
}, {
  message: 'Return date must be at least 1 day after pickup',
  path: ['endDate'],
});

const BookingWidget = ({ car }) => {
  const [isAvailable, setIsAvailable] = useState(null); // null, true, false
  const [checking, setChecking] = useState(false);
  
  const { mutateAsync: checkAvailability } = useCheckAvailability();
  const { mutateAsync: createBooking, isLoading: isBooking } = useCreateBooking();
  const { mutateAsync: initPayment, isLoading: isPaying } = useInitializePayment();
  const { data: servicesData, isLoading: loadingServices } = useServices(car.category);
  
  const services = servicesData?.data?.services || [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    trigger,
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      services: [],
    }
  });

  const watchedValues = useWatch({ control });
  const selectedServices = watchedValues.services || [];

  // Price Calculation
  const priceSummary = useMemo(() => {
    if (!watchedValues.startDate || !watchedValues.endDate) return null;
    
    const start = dayjs(watchedValues.startDate);
    const end = dayjs(watchedValues.endDate);
    const days = end.diff(start, 'day');
    
    if (days <= 0) return null;

    const basePrice = days * car.rentalPrice;
    const servicesPrice = selectedServices.reduce((acc, serviceId) => {
      const service = services.find(s => s._id === serviceId);
      return acc + (service?.price || 0);
    }, 0);

    return {
      days,
      basePrice,
      servicesPrice,
      total: basePrice + servicesPrice
    };
  }, [watchedValues.startDate, watchedValues.endDate, selectedServices, services, car.rentalPrice]);

  // Auto-check availability when dates change
  useEffect(() => {
    const debouncedCheck = setTimeout(async () => {
      if (watchedValues.startDate && watchedValues.endDate && isValid) {
        setChecking(true);
        try {
          const res = await checkAvailability({
            carId: car._id,
            startDate: watchedValues.startDate,
            endDate: watchedValues.endDate
          });
          setIsAvailable(res.data.available);
        } catch (err) {
          setIsAvailable(false);
        } finally {
          setChecking(false);
        }
      }
    }, 600); // Small debounce

    return () => clearTimeout(debouncedCheck);
  }, [watchedValues.startDate, watchedValues.endDate, isValid, car._id, checkAvailability]);

  const onCheckAvailability = async () => {
    const valid = await trigger(['startDate', 'endDate']);
    if (!valid) return;

    setChecking(true);
    try {
      const res = await checkAvailability({
        carId: car._id,
        startDate: watchedValues.startDate,
        endDate: watchedValues.endDate
      });
      setIsAvailable(res.data.available);
      if (!res.data.available) {
        toast.error('Car is not available for these dates');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  const onSubmit = async (data) => {
    if (isAvailable !== true) {
      await onCheckAvailability();
      return;
    }

    try {
      const bookingRes = await createBooking({
        carId: car._id,
        startDate: data.startDate,
        endDate: data.endDate,
        services: data.services
      });

      const bookingId = bookingRes.data._id;
      
      const paymentRes = await initPayment({
        type: 'booking',
        relatedId: bookingId
      });

      toast.success('Booking successful! Redirecting to payment...');
      if (paymentRes.data.url) {
        window.location.href = paymentRes.data.url;
      }
    } catch (err) {
      // Error handled by react-query global toast
    }
  };

  return (
    <Card className="sticky top-24 border-slate-200 shadow-xl overflow-hidden rounded-[2rem]">
      <CardContent className="p-8">
        <div className="mb-6">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Rental Rate</p>
          <div className="flex items-baseline gap-1 focus-within:">
            <span className="text-4xl font-black tracking-tighter">${car.rentalPrice}</span>
            <span className="text-slate-500 font-bold">/ day</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Start Date"
              type="date"
              min={dayjs().format('YYYY-MM-DD')}
              {...register('startDate')}
              error={errors.startDate}
              onChange={(e) => {
                register('startDate').onChange(e);
                setIsAvailable(null);
              }}
            />
            <Input 
              label="End Date"
              type="date"
              min={watchedValues.startDate || dayjs().format('YYYY-MM-DD')}
              {...register('endDate')}
              error={errors.endDate}
               onChange={(e) => {
                register('endDate').onChange(e);
                setIsAvailable(null);
              }}
            />
          </div>

          {services.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Enhance Your Ride</label>
                <Badge variant="outline" className="text-[10px] font-bold">{services.length} AVAILABLE</Badge>
              </div>
              <div className="space-y-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                {services.map((service) => (
                  <label 
                    key={service._id} 
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedServices.includes(service._id) 
                        ? 'border-black bg-slate-50 shadow-sm' 
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        value={service._id}
                        {...register('services')}
                        className="h-5 w-5 rounded-lg"
                      />
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none">{service.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">One-time fee</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-black bg-white px-2 py-1 rounded-lg border shadow-sm">${service.price}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {priceSummary && (
            <div className="p-6 bg-slate-900 text-white rounded-[2rem] space-y-4 shadow-xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span>Standard Rental</span>
                  <span>{priceSummary.days} days</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-slate-400 font-medium">${car.rentalPrice} / day</span>
                  <span className="font-black text-lg">${priceSummary.basePrice.toLocaleString()}</span>
                </div>
              </div>

              {priceSummary.servicesPrice > 0 && (
                <div className="pt-3 border-t border-white/10 space-y-1">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                    <span>Add-ons</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-slate-400 font-medium">Selected Services</span>
                    <span className="font-black text-lg">${priceSummary.servicesPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/20 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Grand Total</span>
                  <span className="text-3xl font-black text-white tracking-tighter">${priceSummary.total.toLocaleString()}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Tax Incl.</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {isAvailable === true ? (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <p className="text-sm font-black text-emerald-900 leading-none">Great choice!</p>
                  <p className="text-xs font-bold text-emerald-600 mt-1">This vehicle is available for Your dates.</p>
                </div>
              </div>
            ) : isAvailable === false ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center text-white shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <div>
                  <p className="text-sm font-black text-red-900 leading-none">Vehicle Unavailable</p>
                  <p className="text-xs font-bold text-red-600 mt-1">Please try different dates or another car.</p>
                </div>
              </div>
            ) : null}

            {isAvailable === true ? (
              <Button 
                type="submit" 
                className="w-full h-16 text-xl font-black rounded-3xl bg-black hover:bg-black/90 shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
                isLoading={isBooking || isPaying}
              >
                Book & Pay Now
              </Button>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-16 text-lg font-black rounded-3xl border-2 transition-all"
                onClick={onCheckAvailability}
                isLoading={checking}
                disabled={!watchedValues.startDate || !watchedValues.endDate}
              >
                {checking ? 'Evaluating...' : 'Check Availability'}
              </Button>
            )}
            
            <div className="flex justify-center items-center gap-4 py-2">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200" />
                 ))}
               </div>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                 12 others booked this car recently
               </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingWidget;
