import React, { useState, useEffect } from 'react';

const SafeImage = ({ src, alt, className, fallback = 'https://placehold.co/600x400?text=No+Image' }) => {
  const [error, setError] = useState(false);

  // Reset error state when source changes so we try to load the new image
  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <img 
      src={error ? fallback : (src || fallback)} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)}
    />
  );
};

export default SafeImage;
