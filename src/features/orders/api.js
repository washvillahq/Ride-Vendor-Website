import api from '../../lib/axios';

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders/my');
  return response;
};
