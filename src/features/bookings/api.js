import api from '../../lib/axios';

export const checkAvailability = async (params) => {
  const response = await api.get('/bookings/check-availability', { params });
  return response;
};

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response;
};

export const getMyBookings = async () => {
  const response = await api.get('/bookings/my');
  return response;
};
