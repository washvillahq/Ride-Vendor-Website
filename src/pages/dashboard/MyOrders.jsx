import React from 'react';
import { useMyOrders } from '../../features/orders/hooks';
import { PageHeader } from '../../components/shared/Headers';
import StatusBadge from '../../components/ui/StatusBadge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import dayjs from 'dayjs';

const MyOrders = () => {
  const { data, isLoading, isError, refetch } = useMyOrders();
  const orders = data?.data?.orders || [];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Orders" 
        description="History of your vehicle purchases and ownership transfers."
      />

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : orders.length > 0 ? (
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="text-xs font-black text-slate-400 uppercase">
                    #{order._id.slice(-8)}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">{order.car?.name || 'Deleted Car'}</div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {dayjs(order.createdAt).format('MMM DD, YYYY')}
                  </TableCell>
                  <TableCell className="font-black text-slate-900 text-lg">
                    ${order.totalPrice?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.paymentStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : !isLoading ? (
        <EmptyState 
          title="No orders found" 
          description="You haven't made any car purchases yet. Check out our 'For Sale' collection!"
        />
      ) : (
        <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
           Loading Orders...
        </div>
      )}
    </div>
  );
};

export default MyOrders;
