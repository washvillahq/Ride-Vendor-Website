import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as serviceApi from './api';
import { QUERY_KEYS } from '../../lib/react-query';

export const useServices = (category) => {
  return useQuery({
    queryKey: ['services', category],
    queryFn: async () => {
      const response = await serviceApi.getServices();
      // Temporary frontend filtering if backend doesn't support it
      if (category && response.data) {
        return {
          ...response,
          data: response.data.filter(s => !s.category || s.category === category)
        };
      }
      return response;
    },
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: serviceApi.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};
