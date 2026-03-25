import React from 'react';
import { useAdminOrders, useUpdateOrderStatus } from '../../features/admin/hooks';
import { PageHeader } from '../../components/shared/Headers';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import Select from '../../components/ui/Select';
import { cn } from '../../utils/cn';
import { 
  ShoppingBag, 
  User, 
  Car, 
  Calendar, 
  CreditCard, 
  Search,
  Filter,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import dayjs from 'dayjs';

const AdminOrders = () => {
  const { data, isLoading, refetch } = useAdminOrders();
  const { mutateAsync: updateStatus, isLoading: isUpdating } = useUpdateOrderStatus();
  
  const orders = data?.data?.data || data?.data?.orders || [];

  const handleStatusChange = async (id, status) => {
    if (window.confirm(`Action Required: Are you sure you want to update this order status to ${status.toUpperCase()}?`)) {
      await updateStatus({ id, status });
      refetch();
    }
  };

  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-primary tracking-tight">Sales Oversight</h1>
           <p className="text-gray-medium mt-1 font-medium">Monitor vehicle purchase requests and title transfer procedures.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="pl-11 pr-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all w-64 shadow-sm"
              />
           </div>
           <button className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm text-gray-medium">
              <Filter size={18} />
           </button>
        </div>
      </section>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="py-5 px-8 font-black uppercase tracking-widest text-[10px]">Merchant / Asset</TableHead>
              <TableHead className="py-5 font-black uppercase tracking-widest text-[10px]">Timestamp</TableHead>
              <TableHead className="py-5 font-black uppercase tracking-widest text-[10px]">Valuation</TableHead>
              <TableHead className="py-5 font-black uppercase tracking-widest text-[10px]">Settlement</TableHead>
              <TableHead className="py-5 px-8 font-black uppercase tracking-widest text-[10px] text-right">Transaction Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : orders.length > 0 ? orders.map((order) => (
              <TableRow key={order._id} className="group hover:bg-gray-50/50 transition-colors">
                <TableCell className="py-6 px-8">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-[10px]">
                         {order.user?.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                         <p className="font-black text-primary leading-none">{order.user?.name || 'Customer'}</p>
                         <div className="flex items-center gap-1.5 mt-1.5 font-bold text-[9px] text-gray-medium uppercase tracking-widest">
                            <Car size={10} className="text-accent" />
                            {order.car?.title || 'Unknown Vehicle'}
                         </div>
                      </div>
                   </div>
                </TableCell>
                <TableCell className="py-6 font-black text-gray-medium text-xs">
                   <div className="flex flex-col">
                      <span className="flex items-center gap-1.5">
                         <Calendar size={12} className="text-gray-300" />
                         {dayjs(order.createdAt).format('MMM D, YYYY')}
                      </span>
                      <span className="text-[9px] font-bold text-gray-medium uppercase tracking-widest mt-1 ml-4.5">
                         at {dayjs(order.createdAt).format('hh:mm A')}
                      </span>
                   </div>
                </TableCell>
                <TableCell className="py-6 font-black text-primary text-lg">
                   ₦{order.totalPrice?.toLocaleString()}
                </TableCell>
                <TableCell className="py-6">
                   <StatusBadge status={order.paymentStatus} className="text-[9px] font-black uppercase px-3 rounded-lg" />
                </TableCell>
                <TableCell className="py-6 px-8 text-right">
                   <div className="flex justify-end">
                      <Select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        options={statuses}
                        className="max-w-[140px] h-10 text-[10px] font-black uppercase tracking-widest bg-gray-100 border-none rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                        disabled={isUpdating}
                      />
                   </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center text-gray-medium italic">No sales transactions identified.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;
