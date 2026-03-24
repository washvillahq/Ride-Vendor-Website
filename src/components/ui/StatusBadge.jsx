import React from 'react';
import Badge from './Badge';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (s) => {
    switch (s?.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'confirmed':
      case 'success':
      case 'shipped':
      case 'delivered':
        return { variant: 'success', label: s };
      case 'pending':
      case 'waiting':
      case 'processing':
        return { variant: 'secondary', label: s };
      case 'cancelled':
      case 'failed':
      case 'rejected':
      case 'error':
        return { variant: 'destructive', label: s };
      default:
        return { variant: 'outline', label: s || 'unknown' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
