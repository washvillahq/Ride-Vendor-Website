import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../../services/hooks';
import { useCreateBooking } from '../../bookings/hooks';
import { 
  ChevronRight, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  CreditCard,
  Info
} from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Skeleton from '../../../components/ui/Skeleton';
import Modal from '../../../components/ui/Modal';
import { toast } from 'react-hot-toast';

const STEPS = [
  { id: 1, title: 'Services', icon: ShieldCheck },
  { id: 2, title: 'Dates', icon: CalendarIcon },
  { id: 3, title: 'Details', icon: Info },
  { id: 4, title: 'Review', icon: CreditCard },
];

const HireCheckoutModal = ({ isOpen, onClose, car }) => {
  const navigate = useNavigate();
  const { data: servicesData, isLoading: isServicesLoading } = useServices(car?.category);
  const services = servicesData?.data || [];
  const { mutate: createBooking, isLoading: isCreating } = useCreateBooking();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [details, setDetails] = useState({ pickupLocation: '', dropoffLocation: '', specialRequests: '' });

  const totalDays = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return 0;
    const diff = dayjs(dateRange.to).diff(dayjs(dateRange.from), 'day');
    return Math.max(1, diff + 1);
  }, [dateRange]);

  const totalPrice = useMemo(() => {
    if (!car) return 0;
    const carPrice = car.pricePerDay || 0;
    const servicesPrice = selectedServices.reduce((total, id) => {
      const service = services.find(s => s._id === id);
      return total + (service?.pricePerDay || 0);
    }, 0);
    return (carPrice + servicesPrice) * totalDays;
  }, [car, services, selectedServices, totalDays]);

  const handleNext = () => {
    if (currentStep === 2 && (!dateRange.from || !dateRange.to)) {
      toast.error('Please select both start and end dates');
      return;
    }
    if (currentStep === 3 && (!details.pickupLocation || !details.dropoffLocation)) {
      toast.error('Please provide pickup and dropoff locations');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onClose();
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleBooking = () => {
    const bookingData = {
      carId: car._id,
      startDate: dateRange.from,
      endDate: dateRange.to,
      services: selectedServices,
      pickupLocation: details.pickupLocation,
      dropoffLocation: details.dropoffLocation,
      specialRequests: details.specialRequests
    };

    createBooking(bookingData, {
      onSuccess: (response) => {
        toast.success('Booking initiated! Proceeding to payment...');
        onClose();
        if (response?.data?.paymentUrl) {
           window.location.href = response.data.paymentUrl;
        } else {
           navigate(`/dashboard/bookings`);
        }
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create booking');
      }
    });
  };

  // Pre-reset modal state when closed to ensure fresh start next time
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setSelectedServices([]);
        setDateRange({ from: undefined, to: undefined });
        setDetails({ pickupLocation: '', dropoffLocation: '', specialRequests: '' });
      }, 300); // Wait for modal close animation
    }
  }, [isOpen]);

  if (!car) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Hire ${car.brand} ${car.model}`}
      maxWidth="4xl"
      className="max-h-[85vh] flex flex-col"
    >
      {/* Steps Header */}
      <div className="bg-slate-50 border-b border-slate-100 p-4 shrink-0">
        <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto hidden sm:flex">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-accent text-primary shadow-md scale-110' : 
                    isCompleted ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300 border border-slate-200'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full mb-4 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-slate-900 leading-tight">Enhance Your Experience</h2>
                  <p className="text-slate-500 text-sm">Select additional services tailored for this vehicle.</p>
                </div>

                {isServicesLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.length > 0 ? (
                      services.map(service => (
                        <div 
                          key={service._id}
                          onClick={() => handleServiceToggle(service._id)}
                          className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                            selectedServices.includes(service._id)
                              ? 'border-accent bg-accent/5'
                              : 'border-slate-50 bg-slate-50 hover:border-slate-200 hover:bg-white'
                          }`}
                        >
                           <div className="flex items-start justify-between gap-2">
                             <div className="space-y-1">
                               <h4 className="font-bold text-slate-900 text-sm leading-tight">{service.name}</h4>
                               <p className="text-[10px] text-slate-500 uppercase tracking-wide">{service.description}</p>
                             </div>
                             <div className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                               selectedServices.includes(service._id) ? 'bg-accent border-accent text-primary' : 'border-slate-200'
                             }`}>
                               {selectedServices.includes(service._id) && <CheckCircle2 className="w-3 h-3" />}
                             </div>
                           </div>
                           <div className="pt-3">
                              <span className="text-sm font-black text-slate-900">₦{service.pricePerDay?.toLocaleString()}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">/ Day</span>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-10 text-center space-y-2">
                         <p className="text-slate-400 font-bold uppercase text-xs">No extra services available.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <div className="space-y-1">
                   <h2 className="text-xl font-black text-slate-900 leading-tight">When would you like it?</h2>
                   <p className="text-slate-500 text-sm">Select your preferred start and return dates.</p>
                 </div>

                 <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-100 flex justify-center">
                   <DayPicker
                     mode="range"
                     selected={dateRange}
                     onSelect={setDateRange}
                     disabled={{ before: new Date() }}
                     numberOfMonths={1}
                     className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
                     styles={{
                       day: { fontWeight: '700', fontSize: '0.8rem' },
                       head_cell: { textTransform: 'uppercase', fontSize: '0.7rem' }
                     }}
                   />
                 </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <div className="space-y-1">
                   <h2 className="text-xl font-black text-slate-900 leading-tight">Delivery & Logistics</h2>
                   <p className="text-slate-500 text-sm">Tell us where we should meet you.</p>
                 </div>

                 <div className="space-y-4">
                    <Input 
                      label="Pickup Location"
                      placeholder="e.g. Airport Arrivals, Hotel, or Home"
                      icon={<MapPin size={16} />}
                      value={details.pickupLocation}
                      onChange={(e) => setDetails(prev => ({...prev, pickupLocation: e.target.value}))}
                    />
                    <Input 
                      label="Dropoff Location"
                      placeholder="e.g. Same as pickup"
                      icon={<MapPin size={16} />}
                      value={details.dropoffLocation}
                      onChange={(e) => setDetails(prev => ({...prev, dropoffLocation: e.target.value}))}
                    />
                    <Textarea 
                      label="Special Requests"
                      placeholder="Any other preferences we should know about?"
                      value={details.specialRequests}
                      onChange={(e) => setDetails(prev => ({...prev, specialRequests: e.target.value}))}
                    />
                 </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <div className="space-y-1">
                   <h2 className="text-xl font-black text-slate-900 leading-tight">Review Your Booking</h2>
                   <p className="text-slate-500 text-sm">Please verify all details before payment.</p>
                 </div>

                 <div className="space-y-4">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Logistics</h3>
                       <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                          <span className="font-bold text-slate-700">{details.pickupLocation} → {details.dropoffLocation}</span>
                       </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Dates & Duration</h3>
                       <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                         <span>{dateRange.from ? dayjs(dateRange.from).format('MMM D') : 'N/A'} - {dateRange.to ? dayjs(dateRange.to).format('MMM D, YYYY') : 'N/A'}</span>
                         <span>{totalDays} Days</span>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
             <div className="bg-[#002D3A] rounded-3xl p-6 text-white space-y-6 shadow-xl relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="space-y-0.5">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pricing Summary</p>
                     <p className="text-sm font-bold border-b border-white/10 pb-2">
                       ₦{car.pricePerDay?.toLocaleString()} × {totalDays} days
                     </p>
                  </div>

                  {selectedServices.length > 0 && (
                    <div className="space-y-2 border-b border-white/10 pb-4">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Services added</p>
                       {selectedServices.map(id => {
                         const s = services.find(x => x._id === id);
                         return (
                           <div key={id} className="flex justify-between items-center text-xs">
                             <span className="text-slate-300">{s?.name}</span>
                             <span className="font-bold">₦{(s?.pricePerDay * totalDays).toLocaleString()}</span>
                           </div>
                         );
                       })}
                    </div>
                  )}

                  <div className="pt-2">
                     <p className="text-[9px] font-black text-accent uppercase tracking-[0.2em] mb-1">Total</p>
                     <span className="text-3xl font-black text-accent tracking-tighter">₦{totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-[-15deg] pointer-events-none">
                  <ShieldCheck size={120} strokeWidth={1} />
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-slate-50 border-t border-slate-100 p-4 sm:p-6 shrink-0 flex items-center justify-between">
         <Button 
           variant="ghost" 
           onClick={handleBack}
           className="text-xs uppercase tracking-wider"
         >
           {currentStep === 1 ? 'Cancel' : 'Back'}
         </Button>
         
         {currentStep < 4 ? (
           <Button 
             onClick={handleNext}
             className="px-8 bg-black hover:bg-slate-800 text-white rounded-xl text-xs uppercase tracking-widest shadow-md"
           >
             Continue
           </Button>
         ) : (
           <Button 
             onClick={handleBooking}
             isLoading={isCreating}
             className="bg-accent hover:bg-accent/90 text-primary px-8 rounded-xl text-xs font-black uppercase tracking-widest shadow-md"
           >
             Pay ₦{totalPrice?.toLocaleString()}
           </Button>
         )}
      </div>
    </Modal>
  );
};

export default HireCheckoutModal;
