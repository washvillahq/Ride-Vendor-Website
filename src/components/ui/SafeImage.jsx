import React, { useState } from 'react';

const SafeImage = ({ src, alt, className, fallback = 'https://placehold.co/600x400?text=No+Image' }) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className} 
      onError={() => setImgSrc(fallback)}
    />
  );
};

export default SafeImage;
