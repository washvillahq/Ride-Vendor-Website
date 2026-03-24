import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as carApi from './api';
import { QUERY_KEYS } from '../../lib/react-query';

/**
 * Hook for fetching a list of cars
 */
export const useCars = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.cars.list(filters),
    queryFn: () => carApi.getCars(filters),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook for fetching a single car's details
 */
export const useCar = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.cars.detail(id),
    queryFn: () => carApi.getCarById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: carApi.createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cars.lists() });
    },
  });
};
export const useCarAvailability = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.cars.detail(id, 'availability'),
    queryFn: () => carApi.getCarAvailability(id),
    enabled: !!id,
    staleTime: 1000 * 30, // 30 seconds to stay fresh but not spam API
  });
};

export const useUpdateCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: carApi.updateCar,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cars.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cars.detail(id) });
    },
  });
};

export const useDeleteCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: carApi.deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cars.lists() });
    },
  });
};

export const useUploadCarImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: carApi.uploadCarImage,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cars.detail(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cars.lists() });
    },
  });
};
export const useDeleteCarImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: carApi.deleteCarImage,
    onSuccess: (_, { carId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cars.detail(carId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cars.lists() });
    },
  });
};
