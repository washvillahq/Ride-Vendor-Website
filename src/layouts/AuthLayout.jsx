import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">RideVendor</h1>
          <p className="text-muted-foreground">Access your account</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
