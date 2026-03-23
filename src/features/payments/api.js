import api from '../../lib/axios';

export const initializePayment = async (paymentData) => {
  const response = await api.post('/payments/initialize', paymentData);
  return response;
};

export const reInitializePayment = async (paymentData) => {
  const response = await api.post('/payments/re-initialize', paymentData);
  return response;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post('/payments/verify', paymentData);
  return response;
};
