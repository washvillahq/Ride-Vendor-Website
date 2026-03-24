import api from '../../lib/axios';

/**
 * Fetch cars with filters and pagination
 * @param {Object} params - Query parameters (type, category, searchTerm, location, sort, page, limit)
 */
export const getCars = async (params = {}) => {
  const response = await api.get('/cars', { params });
  return response;
};

/**
 * Fetch a single car by ID
 * @param {string} id - The car ID
 */
export const getCarById = async (id) => {
  const response = await api.get(`/cars/${id}`);
  return response;
};

export const createCar = async (carData) => {
  const response = await api.post('/cars', carData);
  return response;
};
export const getCarAvailability = async (id) => {
  const response = await api.get(`/cars/${id}/availability`);
  return response;
};

export const updateCar = async ({ id, data }) => {
  const response = await api.patch(`/cars/${id}`, data);
  return response;
};

export const deleteCar = async (id) => {
  const response = await api.delete(`/cars/${id}`);
  return response;
};

export const uploadCarImage = async ({ id, file }) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post(`/cars/${id}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};
export const deleteCarImage = async ({ carId, imageId }) => {
  const response = await api.delete(`/cars/${carId}/images/${imageId}`);
  return response;
};
