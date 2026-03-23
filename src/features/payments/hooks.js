import { useMutation } from '@tanstack/react-query';
import * as paymentApi from './api';

export const useInitializePayment = () => {
  return useMutation({
    mutationFn: paymentApi.initializePayment,
  });
};

export const useReInitializePayment = () => {
  return useMutation({
    mutationFn: paymentApi.reInitializePayment,
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: paymentApi.verifyPayment,
  });
};
