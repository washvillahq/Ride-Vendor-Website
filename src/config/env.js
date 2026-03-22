/**
 * Production-ready environment configuration for RideVendor.
 * Centralizes all VITE_ environment variables with validation.
 */

const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'RideVendor',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

// Validation for critical variables
if (env.IS_PROD && !import.meta.env.VITE_API_URL) {
  console.warn('[RideVendor] VITE_API_URL is not set in production!');
}

export default env;
