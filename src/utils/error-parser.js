/**
 * Parse and normalize API errors into a consistent format.
 * Useful for displaying errors in the UI.
 */
export const parseApiError = (error) => {
  if (typeof error === 'string') return error;
  
  // Handle normalized error from axios interceptor
  if (error?.message) return error.message;

  // Fallback
  return 'An unexpected error occurred. Please try again later.';
};

/**
 * Extract validation errors from backend response data.
 * Assumes errors might be in error.data.errors or similar.
 */
export const getValidationErrors = (error) => {
  if (error?.data?.errors) {
    return error.data.errors;
  }
  return null;
};
