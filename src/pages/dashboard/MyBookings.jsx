import React from 'react';
import { useMyBookings } from '../../features/bookings/hooks';
import { PageHeader } from '../../components/shared/Headers';
import StatusBadge from '../../components/ui/StatusBadge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import dayjs from 'dayjs';

const MyBookings = () => {
  const { data, isLoading, isError, refetch } = useMyBookings();
  const bookings = data?.data?.bookings || [];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Bookings" 
        description="Manage your active and upcoming vehicle rentals."
      />

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : bookings.length > 0 ? (
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Booking Status</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold group-hover:bg-slate-200 transition-colors">
                        {booking.car?.brand?.charAt(0)}
                      </div>
                      <div className="font-bold">{booking.car?.name || 'Deleted Car'}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {dayjs(booking.startDate).format('MMM DD')} - {dayjs(booking.endDate).format('MMM DD, YYYY')}
                  </TableCell>
                  <TableCell className="font-black text-slate-900">
                    ${booking.totalPrice?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.paymentStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : !isLoading ? (
        <EmptyState 
          title="No bookings yet" 
          description="You haven't made any bookings. Explore our catalog to find your next ride!"
        />
      ) : (
        <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
           Loading Bookings...
        </div>
      )}
    </div>
  );
};

export default MyBookings;
