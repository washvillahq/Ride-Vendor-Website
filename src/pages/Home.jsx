import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCars } from '../features/cars/hooks';
import { useCmsPage } from '../features/cms/hooks';
import CarCard from '../features/cars/components/CarCard';
import CarCardSkeleton from '../features/cars/components/CarCardSkeleton';
import Button from '../components/ui/Button';
import { SectionHeader } from '../components/shared/Headers';
import Seo from '../components/Seo';

import carhire from '../assets/carhire.png';
import carsale from '../assets/carsale.png';
import caraccessories from '../assets/caraccessories.png';
import carleasing from '../assets/carleasing.png';
import consignement from '../assets/consignement.png';
import vehicletracking from '../assets/vehicletracking.png';
import blogImage from '../assets/blog_image.png';
import book_a_car from '../assets/book_a_car.svg';

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
  ArrowRight,
  Quote,
  Bike
} from 'lucide-react';

const Hero = () => (
  <section className="pt-5 md:pt-10 pb-10 bg-white">
    <div className="container px-2 md:px-4 text-center max-w-6xl mx-auto space-y-6">
      <div className="space-y-6 ">
        <h1 className="text-3xl md:text-5xl font-semibold text-primary leading-[1.15] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
          Reliable Rides, Cars & Delivery in <span className="bg-accent px-2 rounded-lg">Ilorin</span>
        </h1>
        <p className="text-gray-medium text-sm md:text-lg max-w-3xl mx-auto font-medium leading-relaxed">
          Stop wasting time on "I’m coming" drivers and overpriced junk cars. Ride Vendor is Ilorin’s #1 platform for verified car rentals, Tokunbo car sales, and lightning-fast bike delivery for individuals and businesses in Ilorin
        </p>
      </div>

      {/* Service Icons */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-4 sm:gap-6 md:w-[80%] mx-auto pt-2 sm:pt-4">
        {[
          { icon: carhire, lines: ["car hire", "& Rentals"], path: "/car-hire" },
          { icon: carsale, lines: ["car", "sale"], path: "/car-sales" },
          { icon: caraccessories, lines: ["Car Accessories", "& Spare Parts"], path: "/services/parts" },
          { icon: carleasing, lines: ["car", "leasing"], path: "/services/washing" },
          { icon: consignement, lines: ["Vehicle", "Consignment"], path: "/services/consignment" },
          { icon: vehicletracking, lines: ["Vehicle Tracking", "& Security"], path: "/services/tracking" },
          { icon: null, lines: ["Bike", "Delivery"], path: "/logistics", isLogistics: true },
        ].map((service, i) => (
          <Link
            key={i}
            to={service.path}
            className="flex flex-col items-center gap-3 group cursor-pointer animate-in fade-in zoom-in duration-500"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-12 w-12 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 group-hover:bg-accent group-hover:scale-110 transition-all duration-300 overflow-hidden">
              {service.isLogistics
                ? <Bike className="w-6 h-6 text-primary group-hover:text-primary" />
                : <img src={service.icon} alt={service.lines.join(' ')} className="w-6 h-6 object-contain" />
              }
            </div>
            <span className="text-[10px] font-medium text-gray-medium group-hover:text-primary transition-colors uppercase tracking-widest text-center leading-tight">
              {service.lines.map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < service.lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          </Link>
        ))}
      </div>

      {/* Hero CTA Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-8">
        <Link to="/car-hire" className="relative overflow-hidden bg-primary text-white p-8 rounded-[2rem] text-left group cursor-pointer hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-medium">Book a Car Now</h3>
            <p className="text-white/70 text-xs font-medium max-w-[200px]">Clean vehicles. Fast bookings. Reliable service.</p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity rotate-[-15deg] group-hover:rotate-0 duration-500">
            <Car size={160} strokeWidth={1} />
          </div>
        </Link>

        <Link to="/car-sales" className="relative overflow-hidden bg-accent text-slate-900 p-8 rounded-[2rem] text-left group cursor-pointer hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500">
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-medium">List Your Car For Sale</h3>
            <p className="text-primary text-xs font-medium max-w-[200px]">Reach verified buyers and sell faster in Ilorin.</p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity rotate-[-15deg] group-hover:rotate-0 duration-500">
            <ShieldCheck size={160} strokeWidth={1} />
          </div>
        </Link>

        <Link to="/logistics" className="relative overflow-hidden bg-slate-800 text-white p-8 rounded-[2rem] text-left group cursor-pointer hover:shadow-2xl hover:shadow-slate-800/20 transition-all duration-500">
          <div className="relative z-10 space-y-4">
            <span className="inline-block bg-accent text-primary text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">New</span>
            <h3 className="text-2xl font-medium">Same-Day Delivery</h3>
            <p className="text-white/70 text-xs font-medium max-w-[200px]">Bike pickup & delivery anywhere in Ilorin.</p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity rotate-[-15deg] group-hover:rotate-0 duration-500">
            <Bike size={160} strokeWidth={1} />
          </div>
        </Link>
      </div>

      <p className="text-[10px] font-bold text-gray-medium uppercase tracking-[0.2em]">Trusted by individuals and local businesses since 2012.</p>
    </div>
  </section>
);

import RentalCarCard from '../features/cars/components/RentalCarCard';

const FeatureSection = ({ type = 'rental', title }) => {
  const { data, isLoading } = useCars({ type, limit: 4 });
  const cars = data?.data?.cars || [];

  return (
    <section className="py-24 bg-white">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-lg sm:text-3xl font-medium text-primary border-b-4 border-accent pb-2">
            {title}
          </h2>
          <Link to={type === 'rental' ? '/car-hire' : '/car-sales'}>
            <Button variant="outline" className="rounded-full px-4 sm:px-6 text-gray-medium border-gray-200 hover:bg-gray-50">
              More Vehicles
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => <CarCardSkeleton key={i} />)
          ) : cars.length > 0 ? (
            cars.map(car => (
              type === 'rental'
                ? <RentalCarCard key={car._id} car={car} />
                : <CarCard key={car._id} car={car} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-medium font-bold uppercase tracking-widest">No {type} cars available right now.</p>
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
      color: "bg-gray-50",
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
      color: "bg-gray-50",
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
    <section className="py-6 md:py-24 bg-white overflow-hidden">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-1">
              <Quote className="w-20 h-20 text-[#EBEBEB] fill-[#EBEBEB]" />
              <h2 className="text-4xl md:text-4xl font-medium text-primary leading-tight">
                What Our Customers Say About Us
              </h2>
            </div>

            <div className="space-y-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-8" />
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-accent text-accent" />)}
                </div>
                <span className="font-medium text-primary text-2xl tracking-tight">Excellent</span>
              </div>
              <div className="bg-[#FDF2F2] border border-[#FBEAEA] rounded-lg px-4 py-2 inline-block shadow-sm overflow-hidden">
                <p className="text-[10px] font-medium text-[#8A6D3B] uppercase tracking-widest whitespace-nowrap">
                  Based on 37 reviews
                </p>
              </div>
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
                    <p className="text-lg font-medium text-primary leading-relaxed italic">
                      "{t.content}"
                    </p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(j => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white">
                        <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-primary text-sm">{t.name}</p>
                        <p className="text-[10px] font-bold text-gray-medium uppercase tracking-widest opacity-60">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handlePrev}
                className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-accent hover:text-primary transition-all font-medium active:scale-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-accent hover:text-primary transition-all font-medium active:scale-90"
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
      <h2 className="text-3xl font-medium text-primary mb-12">There's so much more to explore</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { tag: "Car Hire Tips", title: "Top 13 Must-Have Car Accessories for Car Owners in Nigeria" },
          { tag: "Car Care Tips", title: "Top 5 Reasons to Choose a Professional Car Wash Service" },
          { tag: "Car Care Tips", title: "Car Paint Fading: 5 Reasons and Solutions" },
        ].map((post, i) => (
          <div key={i} className="space-y-6 group cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${i * 150}ms` }}>
            <div className="aspect-[16/10] bg-gray-50 rounded-[2rem] overflow-hidden relative font-bold text-center">
              <img src={blogImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Blog" />
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-medium text-accent-dark uppercase tracking-widest">{post.tag}</span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-medium text-xl text-primary leading-tight group-hover:text-accent transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-medium text-sm line-clamp-2">
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
  const { data: pageData } = useCmsPage('home');
  const page = pageData?.data;

  return (
    <div className="flex flex-col bg-white">
      <Seo 
        title={page?.title || 'Car Hire, Car Sales & Auto Services in Ilorin'}
        metaTitle={page?.metaTitle}
        description={page?.metaDescription || 'Buy, hire, lease, and manage vehicles with ease. Ride Vendor provides trusted car hire, car sales, and logistics services for individuals and businesses in Ilorin.'}
        image={page?.ogImage}
        url={page?.canonicalUrl || '/'}
        robots={page?.robotsDirective}
      />
      <Hero />
      <FeatureSection
        type="rental"
        title="Premium car hire services"
      />
      <TestimonialsSection />
      {/* <BlogSection /> */}
    </div>
  );
};

export default HomePage;
