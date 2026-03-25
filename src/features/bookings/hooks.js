import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as bookingApi from './api';
import { QUERY_KEYS } from '../../lib/react-query';

export const useCheckAvailability = () => {
  return useMutation({
    mutationFn: bookingApi.checkAvailability,
  });
};

export const useCarAvailabilitySchedule = (carId) => {
  return useQuery({
    queryKey: QUERY_KEYS.bookings.availability(carId),
    queryFn: () => bookingApi.getCarAvailabilitySchedule(carId),
    enabled: !!carId,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingApi.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookings.all });
    },
  });
};

export const useMyBookings = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.bookings.list(filters),
    queryFn: bookingApi.getMyBookings,
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingApi.cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookings.all });
    },
  });
};

export const useExtendBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingApi.extendBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookings.all });
    },
  });
};
