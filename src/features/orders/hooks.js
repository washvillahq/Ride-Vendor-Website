import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as orderApi from './api';
import { QUERY_KEYS } from '../../lib/react-query';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
    },
  });
};

export const useMyOrders = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.orders.list(filters),
    queryFn: orderApi.getMyOrders,
  });
};
