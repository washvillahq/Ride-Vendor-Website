import api from '../../lib/axios';

export const checkAvailability = async (params) => {
  const response = await api.get('/bookings/check-availability', { params });
  return response;
};

export const getCarAvailabilitySchedule = async (carId) => {
  const response = await api.get(`/bookings/${carId}/availability`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response;
};

export const getMyBookings = async () => {
  const response = await api.get('/bookings/my');
  return response;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.patch(`/bookings/${bookingId}/cancel`);
  return response;
};

export const extendBooking = async ({ bookingId, newDates }) => {
  const response = await api.post(`/bookings/${bookingId}/extend`, { newDates });
  return response;
};
