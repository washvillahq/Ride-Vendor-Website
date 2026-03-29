export const seoConfig = {
  siteName: 'RideVendor',
  siteDescription: 'Car hire, car sales, and auto services in Ilorin, Kwara State. Trusted vehicle rentals, car sales, and logistics services for individuals and businesses.',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://ridevendor.com',
  defaultImage: '/og-default.png',
  twitterHandle: '@ridevendor',
  locale: 'en_US',
  country: 'NG',
};

export const getMetaTags = (options = {}) => {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    metaTitle,
  } = options;

  const pageTitle = metaTitle || (title ? `${title} | ${seoConfig.siteName}` : seoConfig.siteName);
  const pageDescription = description || seoConfig.siteDescription;
  const pageImage = image || seoConfig.defaultImage;
  const pageUrl = url || seoConfig.siteUrl;

  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: pageDescription },
    
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: pageImage },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: seoConfig.siteName },
    { property: 'og:locale', content: seoConfig.locale },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: pageImage },
    { name: 'twitter:site', content: seoConfig.twitterHandle },
  ];
};

export const getJsonLd = (type = 'Organization') => {
  if (type === 'Organization') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
      logo: `${seoConfig.siteUrl}/ride_vendor_logo_black.svg`,
      description: seoConfig.siteDescription,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Oniyangi Complex, OFFA GARAGE RAILWAY LINE, off Asa-Dam Road',
        addressLocality: 'Ilorin',
        addressRegion: 'KW',
        postalCode: '240101',
        addressCountry: 'NG',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+2348144123316',
        contactType: 'customer service',
        availableLanguage: 'English',
      },
      sameAs: [
        'https://twitter.com/ridevendor',
        'https://facebook.com/ridevendor',
        'https://instagram.com/ridevendor',
      ],
    };
  }
  
  if (type === 'Product') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: seoConfig.siteName,
      description: seoConfig.siteDescription,
      brand: {
        '@type': 'Brand',
        name: seoConfig.siteName,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'NGN',
        availability: 'https://schema.org/InStock',
      },
    };
  }

  return null;
};
