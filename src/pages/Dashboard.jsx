import React from 'react';

const DashboardPage = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Total Bookings</h3>
        <p className="text-2xl font-bold mt-1">12</p>
      </div>
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Active Orders</h3>
        <p className="text-2xl font-bold mt-1">2</p>
      </div>
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
        <p className="text-2xl font-bold mt-1">Jan 2024</p>
      </div>
    </div>
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="p-4 border-b text-sm font-medium bg-slate-50">You booked a Toyota Camry - Waiting for confirmation</div>
        <div className="p-4 border-b text-sm font-medium bg-slate-50">Payment confirmed for order #4920</div>
        <div className="p-4 text-sm font-medium bg-slate-50">Profile updated successfully</div>
      </div>
    </div>
  </div>
);

export default DashboardPage;
