import api from '../../lib/axios';

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response;
};

export const updateProfile = async ({ userId, data }) => {
  const response = await api.patch(`/users/${userId}`, data);
  return response;
};
