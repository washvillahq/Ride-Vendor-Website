import React from 'react';
import { useAdminBookings, useUpdateBookingStatus } from '../../features/admin/hooks';
import { PageHeader } from '../../components/shared/Headers';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import Select from '../../components/ui/Select';
import { cn } from '../../utils/cn';
import {
  Calendar,
  User,
  Car,
  Clock,
  CreditCard,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import dayjs from 'dayjs';
import Skeleton from '../../components/ui/Skeleton';

const AdminBookings = () => {
  const { data, isLoading, refetch } = useAdminBookings();
  const { mutateAsync: updateStatus, isLoading: isUpdating } = useUpdateBookingStatus();

  const bookings = data?.data?.data || data?.data?.bookings || [];

  const handleStatusChange = async (id, status) => {
    if (window.confirm(`Action Required: Are you sure you want to change this booking status to ${status.toUpperCase()}?`)) {
      await updateStatus({ id, status });
      refetch();
    }
  };

  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'active', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-medium text-primary tracking-tight">Booking Oversight</h1>
          <p className="text-gray-medium mt-1 font-medium">Monitor and manage all customer vehicle rental requests.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search bookings..."
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
              <TableHead className="py-5 px-8 font-medium uppercase tracking-widest text-[10px]">Client / Asset</TableHead>
              <TableHead className="py-5 font-medium uppercase tracking-widest text-[10px]">Schedule Plan</TableHead>
              <TableHead className="py-5 font-medium uppercase tracking-widest text-[10px]">Valuation</TableHead>
              <TableHead className="py-5 font-medium uppercase tracking-widest text-[10px]">Settlement</TableHead>
              <TableHead className="py-5 px-8 font-medium uppercase tracking-widest text-[10px] text-right">Oversight Status</TableHead>
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
            ) : bookings.length > 0 ? bookings.map((booking) => (
              <TableRow key={booking._id} className="group hover:bg-gray-50/50 transition-colors">
                <TableCell className="py-6 px-8">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-medium text-[10px]">
                      {booking.user?.name?.charAt(0) || 'G'}
                    </div>
                    <div>
                      <p className="font-medium text-primary leading-none">{booking.user?.name || 'Guest Participant'}</p>
                      <div className="flex items-center gap-1.5 mt-1.5 font-bold text-[9px] text-gray-medium uppercase tracking-widest">
                        <Car size={10} className="text-accent" />
                        {booking.car?.title || 'Unknown Asset'}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-6 font-medium text-primary text-xs">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-gray-300" />
                      {dayjs(booking.startDate).format('MMM D')} - {dayjs(booking.endDate).format('MMM D')}
                    </span>
                    <span className="text-[9px] font-bold text-gray-medium uppercase tracking-widest mt-1 ml-4.5">
                      {dayjs(booking.endDate).diff(dayjs(booking.startDate), 'day')} Day Rental Cycle
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-6 font-medium text-primary text-base">
                  ₦{booking.totalPrice?.toLocaleString()}
                </TableCell>
                <TableCell className="py-6">
                  <StatusBadge status={booking.paymentStatus} className="text-[9px] font-medium uppercase px-3 rounded-lg" />
                </TableCell>
                <TableCell className="py-6 px-8 text-right">
                  <div className="flex justify-end">
                    <Select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      options={statuses}
                      className="max-w-[140px] h-10 text-[10px] font-medium uppercase tracking-widest bg-gray-100 border-none rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                      disabled={isUpdating}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center text-gray-medium italic">No bookings found in system oversight.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBookings;
