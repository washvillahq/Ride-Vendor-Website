import { toast } from 'react-hot-toast';

/**
 * Unwraps the standard { status, message, data } response format.
 * Returns only the data.
 */
export const unwrapResponse = (response) => {
  if (response?.status === 'success') {
    return response.data;
  }
  return response;
};

/**
 * Handles mutation errors with a toast notification.
 * Custom message can be provided to override the default.
 */
export const handleMutationError = (error, customMessage = null) => {
  const message = customMessage || error.message || 'Operation failed';
  toast.error(message);
  return error;
};

/**
 * Handles mutation success with a toast notification.
 */
export const handleMutationSuccess = (message) => {
  toast.success(message || 'Operation successful');
};
