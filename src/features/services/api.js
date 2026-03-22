import api from '../../lib/axios';

export const getServices = async () => {
  const response = await api.get('/services');
  return response;
};

export const createService = async (serviceData) => {
  const response = await api.post('/services', serviceData);
  return response;
};
