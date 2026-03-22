import { useMutation } from '@tanstack/react-query';
import * as paymentApi from './api';

export const useInitializePayment = () => {
  return useMutation({
    mutationFn: paymentApi.initializePayment,
  });
};
