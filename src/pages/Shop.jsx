import React from 'react';
import Seo from '../components/Seo';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Search } from 'lucide-react';
import { useCmsPage } from '../features/cms/hooks';

const accessories = [
  { id: 1, name: 'Car Floor Mats', category: 'Interior', price: 15000 },
  { id: 2, name: 'Seat Covers Set', category: 'Interior', price: 25000 },
  { id: 3, name: 'Dash Camera', category: 'Electronics', price: 45000 },
  { id: 4, name: 'GPS Navigation Unit', category: 'Electronics', price: 35000 },
  { id: 5, name: 'Car Phone Mount', category: 'Accessories', price: 5000 },
  { id: 6, name: 'Emergency Roadside Kit', category: 'Safety', price: 12000 },
];

const ShopPage = () => {
  const { data: pageData } = useCmsPage('shop');
  const page = pageData?.data;

  return (
    <div className="bg-white min-h-screen pb-20">
      <Seo 
        title={page?.title || 'Car Accessories & Spare Parts'}
        metaTitle={page?.metaTitle}
        description={page?.metaDescription || 'Browse quality car accessories and spare parts at RideVendor. Dash cameras, GPS units, seat covers, and more available in Ilorin.'}
        image={page?.ogImage}
        url={page?.canonicalUrl || '/shop'}
        robots={page?.robotsDirective}
      />
      <div className="container px-4 py-12 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-primary mb-4">Car Accessories & Spare Parts</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enhance your driving experience with our quality accessories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-50 p-8 rounded-[2rem]">
            <Package className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2">Quality Products</h3>
            <p className="text-gray-600">All our accessories are sourced from trusted manufacturers</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem]">
            <Search className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2">Expert Consultation</h3>
            <p className="text-gray-600">Get recommendations for the right accessories for your vehicle</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem]">
            <Package className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2">Installation Available</h3>
            <p className="text-gray-600">Professional installation services for selected products</p>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-primary text-white p-12 rounded-[3rem] text-center">
          <h2 className="text-3xl font-semibold mb-4">Online Store Coming Soon!</h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            We're working on bringing you a full online shopping experience. In the meantime, 
            contact us to inquire about available accessories.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-8 py-4 rounded-2xl hover:bg-white hover:text-primary transition-colors"
          >
            Contact Us <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;