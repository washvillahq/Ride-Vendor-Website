import React from 'react';
import { useMyOrders } from '../../features/orders/hooks';
import { useUpdateOrderStatus } from '../../features/admin/hooks';
import { PageHeader } from '../../components/shared/Headers';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import Select from '../../components/ui/Select';
import dayjs from 'dayjs';

const AdminOrders = () => {
  const { data, isLoading, refetch } = useMyOrders();
  const { mutateAsync: updateStatus, isLoading: isUpdating } = useUpdateOrderStatus();
  
  const orders = data?.data?.orders || [];

  const handleStatusChange = async (id, status) => {
    await updateStatus({ id, status });
    refetch();
  };

  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processed', label: 'Processed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Oversight: Sales" 
        description="Monitor vehicle purchase requests and title transfer procedures."
      />

      <div className="bg-white border rounded-[2rem] overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer / Vehicle</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Transaction Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                   <div>
                      <p className="font-black text-slate-900 leading-none">{order.user?.name || 'Customer'}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{order.car?.name}</p>
                   </div>
                </TableCell>
                <TableCell className="text-sm font-medium">
                   {dayjs(order.createdAt).format('MMM DD, YYYY')}
                </TableCell>
                <TableCell className="font-black text-slate-900 text-lg">${order.totalPrice?.toLocaleString()}</TableCell>
                <TableCell><StatusBadge status={order.paymentStatus} /></TableCell>
                <TableCell>
                   <Select 
                     value={order.status}
                     onChange={(e) => handleStatusChange(order._id, e.target.value)}
                     options={statuses}
                     className="max-w-[150px] h-9 text-xs py-0"
                     disabled={isUpdating}
                   />
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-slate-400 italic">No sales transactions found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;
