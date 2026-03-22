import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../features/auth/hooks';
import Button from '../components/ui/Button';

const AdminLayout = () => {
  const { user } = useAuthStore();
  const { mutate: logout, isLoading } = useLogout();

  return (
    <div className="flex min-h-screen bg-slate-900">
      <aside className="w-64 border-r border-slate-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white">A</div>
          <span className="font-bold text-xl text-white tracking-tighter">RideVendor Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link to="/admin/cars" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            Manage Cars
          </Link>
          <Link to="/admin/services" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            Services
          </Link>
          <Link to="/admin/bookings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            Bookings
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            Orders
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            Users
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800" 
            onClick={() => logout()}
            isLoading={isLoading}
          >
            Exit Admin
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-slate-50">
        <header className="h-16 bg-white border-b flex items-center px-6 justify-between">
          <div className="font-bold md:hidden">Admin</div>
          <div className="flex items-center gap-4">
             <Link to="/">
               <Button variant="outline" size="sm">View Site</Button>
             </Link>
             <div className="h-8 w-8 rounded-full bg-slate-200 border flex items-center justify-center font-bold text-xs uppercase">
                {user?.name?.charAt(0) || 'A'}
             </div>
          </div>
        </header>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
