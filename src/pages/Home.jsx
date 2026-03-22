import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCars } from '../features/cars/hooks';
import CarCard from '../features/cars/components/CarCard';
import CarCardSkeleton from '../features/cars/components/CarCardSkeleton';
import Button from '../components/ui/Button';
import { SectionHeader } from '../components/shared/Headers';

import { 
  Car, 
  Tag, 
  Wrench, 
  Droplets, 
  Truck, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  ArrowRight
} from 'lucide-react';

const Hero = () => (
  <section className="pt-20 pb-10 bg-white">
    <div className="container px-4 text-center max-w-4xl mx-auto space-y-12">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
          Car Hire, Car Sales & Auto <br className="hidden md:block"/> 
          Services in <span className="bg-accent px-2 rounded-lg">Ilorin</span>
        </h1>
        <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          Hire, buy, lease, and manage vehicles with ease. Ride Vendor provides trusted car hire, 
          car sales, and logistics services for individuals and businesses in Ilorin.
        </p>
      </div>

      {/* Service Icons */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-8 pt-4">
        {[
          { icon: Car, label: "Rentals & Services" },
          { icon: Tag, label: "Car Sales" },
          { icon: Wrench, label: "Accessories & Spare Parts" },
          { icon: Droplets, label: "Car Washing" },
          { icon: Truck, label: "Vehicle Consignment" },
          { icon: ShieldCheck, label: "Vehicle Tracking & Security" },
        ].map((service, i) => (
          <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="h-12 w-12 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
               <service.icon className="w-5 h-5 text-slate-700 group-hover:text-primary" />
            </div>
            <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-widest text-center leading-tight">
              {service.label}
            </span>
          </div>
        ))}
      </div>

      {/* Hero CTA Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto pt-8">
        <div className="relative overflow-hidden bg-primary text-white p-8 rounded-[2rem] text-left group cursor-pointer hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-black">Book a Car Now</h3>
            <p className="text-slate-400 text-xs font-medium max-w-[200px]">Clean vehicles. Fast bookings. Reliable service.</p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity rotate-[-15deg] group-hover:rotate-0 duration-500">
             <Car size={160} strokeWidth={1} />
          </div>
        </div>

        <div className="relative overflow-hidden bg-accent text-slate-900 p-8 rounded-[2rem] text-left group cursor-pointer hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500">
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-black">List Your Car For Sale</h3>
            <p className="text-slate-800 text-xs font-medium max-w-[200px]">Reach verified buyers and sell faster in Ilorin.</p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity rotate-[-15deg] group-hover:rotate-0 duration-500">
             <ShieldCheck size={160} strokeWidth={1} />
          </div>
        </div>
      </div>
      
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-4">Trusted by individuals and local businesses since 2012.</p>
    </div>
  </section>
);

const FeatureSection = ({ type = 'rental', title }) => {
  const { data, isLoading } = useCars({ type, limit: 4 });
  const cars = data?.data?.cars || [];

  return (
    <section className="py-24 bg-white">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-slate-900 border-b-4 border-accent pb-2">
            {title}
          </h2>
          <Link to={`/cars?type=${type}`}>
            <Button variant="outline" className="rounded-full px-6 font-bold text-slate-600 border-slate-200 hover:bg-slate-50">
              More Vehicles
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => <CarCardSkeleton key={i} />)
          ) : cars.length > 0 ? (
            cars.map(car => <CarCard key={car._id} car={car} />)
          ) : (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase tracking-widest">No {type} cars available right now.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    { 
      name: "Katherine Moss", 
      role: "Project Manager, Luylit", 
      color: "bg-accent",
      content: "We've really sped up our workflow using Ride Vendor and haven't looked back."
    },
    { 
      name: "James Wilson", 
      role: "CEO, TechFlow", 
      color: "bg-slate-50",
      content: "The easiest car rental experience I've had in Ilorin. Verified vehicles and great support."
    },
    { 
      name: "Sarah Alabi", 
      role: "Business Owner", 
      color: "bg-accent",
      content: "Listed my car and got a buyer within 3 days. The inspection report really helped build trust."
    },
    { 
      name: "David Chen", 
      role: "Frequent Traveler", 
      color: "bg-slate-50",
      content: "Airport pickup was seamless. The car was clean and the driver was professional."
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
               <div className="h-1 bg-accent w-12" />
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                 What Our Customers Say About Us
               </h2>
            </div>
            
            <div className="space-y-4">
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-8" />
               <div className="flex items-center gap-2">
                 <div className="flex gap-1">
                   {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-accent text-accent" />)}
                 </div>
                 <span className="font-black text-slate-900 text-xl tracking-tight">Excellent</span>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest border border-slate-100 rounded-lg px-4 py-2 inline-block">
                 Based on 27 reviews
               </p>
            </div>
          </div>

          <div className="lg:col-span-2 relative">
             <div className="relative overflow-hidden">
               <div 
                 className="flex gap-6 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                 style={{ transform: `translateX(-${currentIndex * 324}px)` }}
               >
                  {testimonials.map((t, i) => (
                    <div 
                      key={i} 
                      className={`flex-shrink-0 w-[300px] ${t.color} p-8 md:p-10 rounded-[2.5rem] space-y-8 snap-center hover:scale-[1.02] transition-transform duration-500`}
                    >
                       <p className="text-lg font-black text-slate-900 leading-relaxed italic">
                         "{t.content}"
                       </p>
                       <div className="flex gap-1">
                         {[1,2,3,4,5].map(j => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white">
                            <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm">{t.name}</p>
                            <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest opacity-60">{t.role}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
             </div>
             
             <div className="flex gap-3 mt-8">
                <button 
                  onClick={handlePrev}
                  className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-accent hover:text-primary transition-all font-black active:scale-90"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleNext}
                  className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-accent hover:text-primary transition-all font-black active:scale-90"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BlogSection = () => (
  <section className="py-24 bg-white">
    <div className="container px-4">
       <h2 className="text-3xl font-black text-slate-900 mb-12">There's so much more to explore</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { tag: "Car Hire Tips", title: "Top 13 Must-Have Car Accessories for Car Owners in Nigeria" },
            { tag: "Car Care Tips", title: "Top 5 Reasons to Choose a Professional Car Wash Service" },
            { tag: "Car Care Tips", title: "Car Paint Fading: 5 Reasons and Solutions" },
          ].map((post, i) => (
            <div key={i} className="space-y-6 group cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${i * 150}ms` }}>
               <div className="aspect-[16/10] bg-slate-100 rounded-[2rem] overflow-hidden relative">
                  <img src={`https://images.unsplash.com/photo-1590235225167-15c8a2417b65?auto=format&fit=crop&q=80&w=800&u=${i}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Blog" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black text-accent-dark uppercase tracking-widest">{post.tag}</span>
                     <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-black text-xl text-slate-900 leading-tight group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2">
                    In Nigeria, the experience has major seasons — the wet and dry seasons, with the...
                  </p>
               </div>
            </div>
          ))}
       </div>
    </div>
  </section>
);

const HomePage = () => {
  return (
    <div className="flex flex-col bg-white">
      <Hero />
      <FeatureSection 
        type="rental" 
        title="Premium car hire services" 
      />
      <TestimonialsSection />
      <BlogSection />
    </div>
  );
};

export default HomePage;
