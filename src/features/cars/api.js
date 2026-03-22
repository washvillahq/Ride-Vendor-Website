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
