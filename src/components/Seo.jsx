import { useEffect } from 'react';
import { getJsonLd, getMetaTags, getSeoConfig } from '../config/seo';

const MANAGED_ATTR = 'data-rv-seo';

const getAbsoluteUrl = (value) => {
  const config = getSeoConfig();
  if (!value) return config.siteUrl;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  const encoded = encodeURI(normalized);
  return `${config.siteUrl}${encoded}`;
};

const clearManagedTags = () => {
  document
    .querySelectorAll(`[${MANAGED_ATTR}="true"]`)
    .forEach((node) => node.remove());
};

const appendMeta = (attrs) => {
  const name = attrs.name;
  const property = attrs.property;

  if (name) {
    const existing = document.querySelector(`meta[name="${name}"]:not([${MANAGED_ATTR}="true"])`);
    if (existing) {
      Object.entries(attrs).forEach(([key, val]) => {
        existing.setAttribute(key, val);
      });
      existing.setAttribute(MANAGED_ATTR, 'true');
      return;
    }
  }

  if (property) {
    const existing = document.querySelector(`meta[property="${property}"]:not([${MANAGED_ATTR}="true"])`);
    if (existing) {
      Object.entries(attrs).forEach(([key, val]) => {
        existing.setAttribute(key, val);
      });
      existing.setAttribute(MANAGED_ATTR, 'true');
      return;
    }
  }

  const el = document.createElement('meta');
  Object.entries(attrs).forEach(([key, val]) => {
    el.setAttribute(key, val);
  });
  el.setAttribute(MANAGED_ATTR, 'true');
  document.head.appendChild(el);
};

const appendLink = (attrs) => {
  const rel = attrs.rel;

  if (rel) {
    const existing = document.querySelector(`link[rel="${rel}"]:not([${MANAGED_ATTR}="true"])`);
    if (existing) {
      Object.entries(attrs).forEach(([key, val]) => {
        existing.setAttribute(key, val);
      });
      existing.setAttribute(MANAGED_ATTR, 'true');
      return;
    }
  }

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

const Seo = ({ title, metaTitle, description, image, url, type = 'website', jsonLdType = 'Organization', robots, keywords, jsonLd }) => {
  useEffect(() => {
    const config = getSeoConfig();
    const pathname = window.location.pathname;
    const absoluteUrl = getAbsoluteUrl(url || pathname);
    const absoluteImage = getAbsoluteUrl(image || config.defaultImage);

    const titleSuffix = config.titleSuffix || config.siteName;

    const finalTitle = metaTitle || (title ? `${title} | ${titleSuffix}` : config.siteName);
    document.title = finalTitle;

    clearManagedTags();

    const tags = getMetaTags({
      title: finalTitle,
      metaTitle,
      description,
      image: absoluteImage,
      url: absoluteUrl,
      type,
      keywords,
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

    const resolvedJsonLd = jsonLd || getJsonLd(jsonLdType);
    if (Array.isArray(resolvedJsonLd)) {
      resolvedJsonLd.filter(Boolean).forEach((item) => appendScript(item));
    } else if (resolvedJsonLd) {
      appendScript(resolvedJsonLd);
    }
  }, [title, metaTitle, description, image, url, type, jsonLdType, robots, keywords, jsonLd]);

  return null;
};

export default Seo;
