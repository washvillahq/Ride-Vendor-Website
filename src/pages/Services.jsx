import React from 'react';
import Seo from '../components/Seo';
import { Link } from 'react-router-dom';
import { Car, MapPin, Clock, Shield, Wrench, Fuel } from 'lucide-react';
import { useCmsPage } from '../features/cms/hooks';

const services = [
  {
    icon: Car,
    title: 'Car Hire & Rentals',
    description: 'Daily, weekly, and monthly car rental services with flexible terms.',
    features: ['200km daily mileage included', 'Free Ilorin delivery', 'Full-to-full fuel policy'],
  },
  {
    icon: MapPin,
    title: 'Airport Pickup & Drop-off',
    description: 'Reliable airport transportation services for hassle-free travel.',
    features: ['24/7 availability', 'Flight tracking', 'Professional drivers'],
  },
  {
    icon: Shield,
    title: 'Vehicle Tracking',
    description: 'Advanced GPS tracking for your vehicle security and peace of mind.',
    features: ['Real-time tracking', 'Geo-fencing alerts', 'Mobile app access'],
  },
  {
    icon: Wrench,
    title: 'Car Washing & Detailing',
    description: 'Professional car cleaning and detailing services to keep your vehicle pristine.',
    features: ['Interior & exterior cleaning', 'Premium detailing', 'Convenient pickup & delivery'],
  },
  {
    icon: Fuel,
    title: 'Fuel Card Services',
    description: 'Manage your fleet fuel consumption efficiently with our fuel card program.',
    features: ['Nationwide coverage', 'Detailed reporting', 'Control & monitoring'],
  },
  {
    icon: Car,
    title: 'Car Sales',
    description: 'Buy quality verified vehicles with comprehensive inspection reports.',
    features: ['Verified vehicles', 'Inspection reports', 'Flexible payment options'],
  },
];

const ServicesPage = () => {
  const { data: pageData } = useCmsPage('services');
  const page = pageData?.data;

  return (
    <div className="bg-white min-h-screen pb-20">
      <Seo 
        title={page?.metaTitle || page?.title || 'Our Services'}
        description={page?.metaDescription || 'Explore RideVendor professional car hire, car sales, and auto services in Ilorin. From daily rentals to vehicle tracking, we have you covered.'}
        image={page?.ogImage}
        url={page?.canonicalUrl || '/services'}
        robots={page?.robotsDirective}
      />
      <div className="container px-4 py-12 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-primary mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive vehicle solutions tailored to meet your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                className="bg-white border border-slate-200 p-8 rounded-[2.5rem] hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-primary text-white p-12 rounded-[3rem] text-center">
          <h2 className="text-3xl font-semibold mb-4">Need a Custom Solution?</h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Contact us to discuss your specific vehicle requirements. We offer tailored solutions for businesses and corporate clients.
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-accent text-primary font-semibold px-8 py-4 rounded-2xl hover:bg-white hover:text-primary transition-colors"
          >
            Contact Us Today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
