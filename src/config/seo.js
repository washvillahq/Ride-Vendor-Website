export const seoConfig = {
  siteName: 'RideVendor',
  titleSuffix: 'RideVendor',
  siteDescription: 'Car hire, car sales, and auto services in Ilorin, Kwara State. Trusted vehicle rentals, car sales, and logistics services for individuals and businesses.',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://ridevendor.com',
  defaultImage: '/og-default.png',
  twitterHandle: '@ridevendor',
  locale: 'en_US',
  country: 'NG',
  organizationName: 'RideVendor',
  organizationPhone: '+2348144123316',
  organizationEmail: 'info@ridevendor.com',
};

const RUNTIME_KEY = '__RV_SEO_SETTINGS__';

export const getSeoConfig = () => {
  const runtime = window[RUNTIME_KEY] || {};
  return { ...seoConfig, ...runtime };
};

export const setRuntimeSeoConfig = (settings = {}) => {
  window[RUNTIME_KEY] = {
    ...(window[RUNTIME_KEY] || {}),
    ...settings,
  };
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

  const config = getSeoConfig();
  const titleSuffix = config.titleSuffix || config.siteName;
  const pageTitle = metaTitle || (title ? `${title} | ${titleSuffix}` : config.siteName);
  const pageDescription = description || config.siteDescription;
  const pageImage = image || config.defaultImage;
  const pageUrl = url || config.siteUrl;

  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: pageDescription },
    
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: pageImage },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: config.siteName },
    { property: 'og:locale', content: config.locale },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: pageImage },
    { name: 'twitter:site', content: config.twitterHandle },
  ];
};

export const getJsonLd = (type = 'Organization') => {
  const config = getSeoConfig();

  if (type === 'Organization') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: config.organizationName || config.siteName,
      url: config.siteUrl,
      logo: `${config.siteUrl}/ride_vendor_logo_black.svg`,
      description: config.siteDescription,
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
        telephone: config.organizationPhone,
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
      name: config.siteName,
      description: config.siteDescription,
      brand: {
        '@type': 'Brand',
        name: config.siteName,
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
