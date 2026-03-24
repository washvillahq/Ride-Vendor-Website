import api from '../../lib/axios';

export const getServices = async () => {
  const response = await api.get('/services');
  return response;
};

export const createService = async (serviceData) => {
  const response = await api.post('/services', serviceData);
  return response;
};

export const updateService = async ({ id, data }) => {
  const response = await api.patch(`/services/${id}`, data);
  return response;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response;
};
