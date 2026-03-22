import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as adminApi from './api';
import { QUERY_KEYS } from '../../lib/react-query';
import { toast } from 'react-hot-toast';

export const useAdminStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.stats(),
    queryFn: adminApi.getAdminStats,
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.users(),
    queryFn: adminApi.getAdminUsers,
  });
};

export const useAdminBookings = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.admin.base, 'bookings', params],
    queryFn: () => adminApi.getAdminBookings(params),
  });
};

export const useAdminOrders = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.admin.base, 'orders', params],
    queryFn: () => adminApi.getAdminOrders(params),
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users() });
      toast.success('User blocked successfully');
    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users() });
      toast.success('User unblocked successfully');
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => adminApi.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookings.list() });
      toast.success('Booking status updated');
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list() });
      toast.success('Order status updated');
    },
  });
};
