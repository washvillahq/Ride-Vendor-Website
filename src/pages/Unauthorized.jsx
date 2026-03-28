import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full text-center space-y-10 relative z-10">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-red-600/20 border border-red-500/50 text-red-500">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-3V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h11l4 4V12z" /></svg>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-medium text-white tracking-tight">Access Denied</h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            You don't have the administrative privileges required to view this area of RideVendor.
          </p>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Possible Reasons</p>
            <ul className="text-sm text-slate-300 text-left space-y-3 font-medium">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                Attempting to access Admin territory as a Regular customer.
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                Session has expired and needs re-authentication.
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Link to={useAuthStore.getState().user?.role === 'admin' ? '/admin' : '/dashboard'}>
            <Button className="w-full h-14 rounded-2xl font-medium bg-white text-black hover:bg-slate-200">Go to Dashboard</Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="w-full h-14 rounded-2xl font-medium text-white hover:bg-white/5">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
