import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from './query-keys';

export { QUERY_KEYS };

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (error.code !== 401 && !query.meta?.suppressErrorToast) {
        toast.error(error.message || 'Failed to fetch data');
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(error.message || 'Action failed. Please try again.');
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
