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
