import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Seo from '../components/Seo';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <Seo title="Page Not Found" description="The page you are trying to access does not exist on RideVendor." />
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-[12rem] font-medium text-slate-200 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center pt-8">
            <div className="h-24 w-24 bg-black rounded-3xl rotate-12 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-medium text-slate-900">Page Not Found</h2>
          <p className="text-slate-500 font-medium">
            The vehicle you're looking for might have been sold, or the link you followed is broken.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="default" className="w-full sm:w-auto px-8 h-12 rounded-xl font-bold">Back to Home</Button>
          </Link>
          <Link to="/cars">
            <Button variant="outline" className="w-full sm:w-auto px-8 h-12 rounded-xl font-bold">Browse Fleet</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
