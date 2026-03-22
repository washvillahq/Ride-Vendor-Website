import React from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

const FullPageLoading = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm font-medium text-slate-600 animate-pulse">{message}</p>
    </div>
  );
};

export default FullPageLoading;
