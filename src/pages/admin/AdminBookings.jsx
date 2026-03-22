import React from 'react';
import { useMyBookings } from '../../features/bookings/hooks';
import { useUpdateBookingStatus } from '../../features/admin/hooks';
import { PageHeader } from '../../components/shared/Headers';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import Select from '../../components/ui/Select';
import dayjs from 'dayjs';

const AdminBookings = () => {
  // Using useMyBookings but on admin it should ideally use a generic fetchAll if backend supports it.
  // In our requirements, we reuse the pattern.
  const { data, isLoading, refetch } = useMyBookings();
  const { mutateAsync: updateStatus, isLoading: isUpdating } = useUpdateBookingStatus();
  
  const bookings = data?.data?.bookings || [];

  const handleStatusChange = async (id, status) => {
    await updateStatus({ id, status });
    refetch();
  };

  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Oversight: Bookings" 
        description="Monitor and manage all customer vehicle rental requests across the network."
      />

      <div className="bg-white border rounded-[2rem] overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer / Vehicle</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status Control</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length > 0 ? bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>
                   <div>
                      <p className="font-black text-slate-900 leading-none">{booking.user?.name || 'Guest User'}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{booking.car?.name || 'Unknown Vehicle'}</p>
                   </div>
                </TableCell>
                <TableCell className="text-sm font-medium">
                   {dayjs(booking.startDate).format('MMM D')} - {dayjs(booking.endDate).format('MMM D, YYYY')}
                </TableCell>
                <TableCell className="font-bold">${booking.totalPrice?.toLocaleString()}</TableCell>
                <TableCell><StatusBadge status={booking.paymentStatus} /></TableCell>
                <TableCell>
                   <Select 
                     value={booking.status}
                     onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                     options={statuses}
                     className="max-w-[150px] h-9 text-xs py-0"
                     disabled={isUpdating}
                   />
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-slate-400 italic">No bookings found in system.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBookings;
