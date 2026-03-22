import React from 'react';
import { useAdminStats } from '../../features/admin/hooks';
import { PageHeader } from '../../components/shared/Headers';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../../components/feedback/ErrorState';

const StatCard = ({ title, value, icon, color }) => (
  <Card className="overflow-hidden border-slate-200">
    <CardContent className="p-0">
      <div className="flex items-stretch">
        <div className={`w-2 ${color}`} />
        <div className="p-6 flex items-center justify-between w-full">
          <div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-slate-50 border flex items-center justify-center text-slate-600">
            {icon}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { data, isLoading, isError, refetch } = useAdminStats();
  const stats = data?.data || {};

  if (isError) return <div className="container py-12"><ErrorState onRetry={refetch} /></div>;

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Admin Overview" 
        description="Monitor system performance, user activity, and transaction metrics."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
        ) : (
          <>
            <StatCard 
              title="Total Users" 
              value={stats.totalUsers || 0} 
              color="bg-blue-500"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            />
            <StatCard 
              title="Active Bookings" 
              value={stats.activeBookings || 0} 
              color="bg-emerald-500"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            />
            <StatCard 
              title="Completed Orders" 
              value={stats.totalOrders || 0} 
              color="bg-orange-500"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
            />
            <StatCard 
              title="Total Revenue" 
              value={`$${stats.totalRevenue?.toLocaleString() || 0}`} 
              color="bg-purple-500"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="border-slate-200">
            <CardContent className="p-8 space-y-4">
               <h4 className="text-xl font-black">System Status</h4>
               <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                     <span className="text-sm font-bold">API Gateway</span>
                     <Badge variant="success">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                     <span className="text-sm font-bold">In-Memory Cache</span>
                     <Badge variant="success">Running</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                     <span className="text-sm font-bold">Email Service</span>
                     <Badge variant="warning">Slow Response</Badge>
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="bg-slate-900 border-none text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
            <CardContent className="p-8 relative z-10">
               <h4 className="text-xl font-black mb-4">Quick Actions</h4>
               <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-colors">
                     <p className="font-bold text-sm">System Audit</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Run Now</p>
                  </button>
                  <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-colors">
                     <p className="font-bold text-sm">Generate Report</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Monthly PDF</p>
                  </button>
                  <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-colors">
                     <p className="font-bold text-sm">Cache Purge</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Execute</p>
                  </button>
                   <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-colors">
                     <p className="font-bold text-sm">Health Check</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">View Logs</p>
                  </button>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
