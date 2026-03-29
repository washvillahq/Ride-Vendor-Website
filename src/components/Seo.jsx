import { useEffect } from 'react';
import { getJsonLd, getMetaTags, getSeoConfig } from '../config/seo';

const MANAGED_ATTR = 'data-rv-seo';

const getAbsoluteUrl = (value) => {
  const config = getSeoConfig();
  if (!value) return config.siteUrl;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${config.siteUrl}${normalized}`;
};

const clearManagedTags = () => {
  document
    .querySelectorAll(`[${MANAGED_ATTR}="true"]`)
    .forEach((node) => node.remove());
};

const appendMeta = (attrs) => {
  const el = document.createElement('meta');
  Object.entries(attrs).forEach(([key, val]) => {
    el.setAttribute(key, val);
  });
  el.setAttribute(MANAGED_ATTR, 'true');
  document.head.appendChild(el);
};

const appendLink = (attrs) => {
  const el = document.createElement('link');
  Object.entries(attrs).forEach(([key, val]) => {
    el.setAttribute(key, val);
  });
  el.setAttribute(MANAGED_ATTR, 'true');
  document.head.appendChild(el);
};

const appendScript = (json) => {
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.textContent = JSON.stringify(json);
  el.setAttribute(MANAGED_ATTR, 'true');
  document.head.appendChild(el);
};

const shouldNoIndex = (pathname) => {
  const noIndexPrefixes = ['/dashboard', '/admin'];
  const noIndexPaths = ['/login', '/register', '/forgot-password', '/reset-password'];

  return noIndexPrefixes.some((prefix) => pathname.startsWith(prefix)) || noIndexPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
};

const Seo = ({ title, description, image, url, type = 'website', jsonLdType = 'Organization', robots }) => {
  useEffect(() => {
    const config = getSeoConfig();
    const pathname = window.location.pathname;
    const absoluteUrl = getAbsoluteUrl(url || pathname);
    const absoluteImage = getAbsoluteUrl(image || config.defaultImage);

    const titleSuffix = config.titleSuffix || config.siteName;
    document.title = title ? `${title} | ${titleSuffix}` : config.siteName;

    clearManagedTags();

    const tags = getMetaTags({
      title,
      description,
      image: absoluteImage,
      url: absoluteUrl,
      type,
    });

    tags.forEach((tag) => {
      if (tag.charset || tag.name === 'viewport') return;

      if (tag.name) {
        appendMeta({ name: tag.name, content: tag.content });
      } else if (tag.property) {
        appendMeta({ property: tag.property, content: tag.content });
      }
    });

    appendLink({ rel: 'canonical', href: absoluteUrl });

    const robotsValue = robots || (shouldNoIndex(pathname) ? 'noindex,nofollow' : 'index,follow');
    appendMeta({ name: 'robots', content: robotsValue });

    const jsonLd = getJsonLd(jsonLdType);
    if (jsonLd) appendScript(jsonLd);
  }, [title, description, image, url, type, jsonLdType, robots]);

  return null;
};

export default Seo;
