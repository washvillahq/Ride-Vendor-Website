import api from '../../lib/axios';

export const initializePayment = async (paymentData) => {
  const response = await api.post('/payments/initialize', paymentData);
  return response;
};
