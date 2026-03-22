import api from '../../lib/axios';

// Users
export const getAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response;
};

export const blockUser = async (id) => {
  const response = await api.patch(`/admin/users/${id}/block`);
  return response;
};

export const unblockUser = async (id) => {
  const response = await api.patch(`/admin/users/${id}/unblock`);
  return response;
};

// Dashboard Stats
export const getAdminStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response;
};

// Bookings
export const getAdminBookings = async (params = {}) => {
  const response = await api.get('/admin/bookings', { params });
  return response;
};

export const updateBookingStatus = async (id, status) => {
  const response = await api.patch(`/admin/bookings/${id}/status`, { status });
  return response;
};

// Orders
export const getAdminOrders = async (params = {}) => {
  const response = await api.get('/admin/orders', { params });
  return response;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/admin/orders/${id}/status`, { status });
  return response;
};
