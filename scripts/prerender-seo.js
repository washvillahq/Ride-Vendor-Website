#!/usr/bin/env node
/**
 * Build-time SEO prerender script.
 *
 * Runs after `vite build`. For each known public route, fetches CMS SEO data
 * from the backend API, injects real meta tags into dist/index.html, and writes
 * a route-specific dist/<slug>/index.html file.
 *
 * Render (and any static host) will serve dist/logistics/index.html directly
 * for /logistics requests — before the SPA catch-all redirect fires — so
 * crawlers see real per-page tags while regular users still get the full SPA.
 *
 * Usage: node scripts/prerender-seo.js
 * Env:   VITE_API_URL  (required in production; falls back to localhost)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_BASE =
  process.env.VITE_API_URL ||
  process.env.API_URL ||
  'http://localhost:5000/api/v1';

const SITE_URL = process.env.VITE_SITE_URL || 'https://ridevendor.com';

const SITE_DEFAULTS = {
  siteName: 'RideVendor',
  titleSuffix: 'RideVendor',
  siteDescription:
    'Car hire, car sales, and auto services in Ilorin, Kwara State. Trusted vehicle rentals, car sales, and logistics services for individuals and businesses.',
  defaultImage: `${SITE_URL}/og-default.png`,
  twitterHandle: '@ridevendor',
  locale: 'en_US',
};

// Routes to prerender. Each entry maps a URL path to a CMS slug.
// Add more routes here as needed.
const ROUTES = [
  { path: '/',                   slug: 'home'                  },
  { path: '/logistics',          slug: 'logistics'             },
  { path: '/about',              slug: 'about'                 },
  { path: '/services',           slug: 'services'              },
  { path: '/contact',            slug: 'contact'               },
  { path: '/shop',               slug: 'shop'                  },
  { path: '/car-sales',          slug: 'car-sales'             },
  { path: '/car-hire',           slug: 'car-hire'              },
  { path: '/cars',               slug: 'cars'                  },
  { path: '/blog',               slug: 'blog'                  },
  { path: '/privacy-policy',     slug: 'privacy-policy'        },
  { path: '/refund-policy',      slug: 'refund-policy'         },
  { path: '/terms-and-conditions', slug: 'terms-and-conditions'},
  { path: '/cookie-policy',      slug: 'cookie-policy'         },
];

// Hardcoded per-page fallbacks for pages not seeded in the CMS.
// These mirror the hardcoded defaults in each page component.
const WHATSAPP_LINK = `https://wa.me/2349069999851?text=${encodeURIComponent("Hello! I'd like to book a delivery in Ilorin, Kwara State. Please assist me.")}`;

const PAGE_FALLBACKS = {
  logistics: {
    metaTitle: 'Bike Delivery in Ilorin, Kwara | Same-Day Last-Mile Delivery',
    metaDescription:
      'Book same-day bike delivery in Ilorin, Kwara State with Ride Vendor Logistics. Fast pickup, secure last-mile delivery, and WhatsApp booking for businesses and individuals.',
    focusKeyword:
      'bike delivery in Ilorin, same day delivery Ilorin, last mile delivery Kwara, dispatch rider Ilorin',
    robotsDirective: 'index,follow',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Ride Vendor Logistics Bike Delivery',
        serviceType: 'Same-day last-mile delivery',
        description:
          'Book same-day bike delivery in Ilorin, Kwara State with Ride Vendor Logistics. Fast pickup, secure last-mile delivery, and WhatsApp booking for businesses and individuals.',
        url: `${SITE_URL}/logistics`,
        areaServed: [
          { '@type': 'City', name: 'Ilorin' },
          { '@type': 'AdministrativeArea', name: 'Kwara State' },
          { '@type': 'Country', name: 'Nigeria' },
        ],
        provider: {
          '@type': 'Organization',
          name: 'Ride Vendor Logistics',
          url: SITE_URL,
          telephone: '+2348144123316',
        },
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: WHATSAPP_LINK,
          availableLanguage: 'English',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I book a delivery?',
            acceptedAnswer: { '@type': 'Answer', text: "Simply send us a WhatsApp message with your pickup address, delivery address, and a description of what you're sending. We'll confirm the details and dispatch a rider immediately." },
          },
          {
            '@type': 'Question',
            name: 'How much does a delivery cost?',
            acceptedAnswer: { '@type': 'Answer', text: 'Pricing depends on distance within Ilorin. We give you a transparent price before any rider is dispatched — no surprises after pickup. Message us for a quick quote.' },
          },
          {
            '@type': 'Question',
            name: 'How fast will my item be delivered?',
            acceptedAnswer: { '@type': 'Answer', text: 'Most deliveries within Ilorin are completed within 1–3 hours. For urgent orders, we prioritise same-hour dispatch.' },
          },
          {
            '@type': 'Question',
            name: 'What areas do you cover?',
            acceptedAnswer: { '@type': 'Answer', text: 'We cover major areas across Ilorin — including GRA, Tanke, Fate, Offa Garage, Asa Dam Road, Garin Alimi, and Unity. Nearby Kwara deliveries can also be arranged on request.' },
          },
          {
            '@type': 'Question',
            name: 'What if my item is fragile or valuable?',
            acceptedAnswer: { '@type': 'Answer', text: "Let us know when you message and we'll handle it with extra care. All our riders are trained to handle items responsibly and are accountable for every delivery." },
          },
          {
            '@type': 'Question',
            name: 'Do you operate on weekends and public holidays?',
            acceptedAnswer: { '@type': 'Answer', text: "Yes — we operate 7 days a week. Whether it's a Saturday afternoon or a public holiday, we're available." },
          },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);

function absoluteUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return SITE_URL.replace(/\/$/, '') + (path.startsWith('/') ? path : '/' + path);
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const body = await res.json();
    return body?.data ?? null;
  } catch {
    return null;
  }
}

function buildHeadBlock(meta) {
  const {
    title,
    description = '',
    robots = 'index,follow',
    keywords = '',
    canonical = '',
    ogType = 'website',
    ogImage = '',
    jsonLd = null,
  } = meta;

  const lines = [];
  lines.push(`<title>${esc(title)}</title>`);
  if (description)  lines.push(`<meta name="description" content="${esc(description)}" />`);
  lines.push(`<meta name="robots" content="${esc(robots)}" />`);
  if (keywords)     lines.push(`<meta name="keywords" content="${esc(keywords)}" />`);
  if (canonical)    lines.push(`<link rel="canonical" href="${esc(canonical)}" />`);

  // OG
  lines.push(`<meta property="og:type" content="${esc(ogType)}" />`);
  if (canonical)    lines.push(`<meta property="og:url" content="${esc(canonical)}" />`);
  lines.push(`<meta property="og:title" content="${esc(title)}" />`);
  if (description)  lines.push(`<meta property="og:description" content="${esc(description)}" />`);
  if (ogImage)      lines.push(`<meta property="og:image" content="${esc(ogImage)}" />`);
  lines.push(`<meta property="og:site_name" content="${esc(SITE_DEFAULTS.siteName)}" />`);
  lines.push(`<meta property="og:locale" content="${esc(SITE_DEFAULTS.locale)}" />`);

  // Twitter
  lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
  if (canonical)    lines.push(`<meta name="twitter:url" content="${esc(canonical)}" />`);
  lines.push(`<meta name="twitter:title" content="${esc(title)}" />`);
  if (description)  lines.push(`<meta name="twitter:description" content="${esc(description)}" />`);
  if (ogImage)      lines.push(`<meta name="twitter:image" content="${esc(ogImage)}" />`);
  lines.push(`<meta name="twitter:site" content="${esc(SITE_DEFAULTS.twitterHandle)}" />`);

  // JSON-LD
  if (jsonLd) {
    const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    for (const schema of schemas) {
      lines.push(`<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
    }
  }

  return lines.join('\n  ');
}

function injectIntoHtml(html, headBlock) {
  const START = '<!--SEO_HEAD_START-->';
  const END   = '<!--SEO_HEAD_END-->';
  const s = html.indexOf(START);
  const e = html.indexOf(END);
  if (s === -1 || e === -1) {
    console.warn('  ⚠  SEO markers not found in index.html — writing file unchanged');
    return html;
  }
  return html.slice(0, s + START.length) + '\n  ' + headBlock + '\n  ' + html.slice(e);
}

function writeRouteHtml(routePath, html) {
  if (routePath === '/') {
    // Overwrite dist/index.html itself for the home page.
    writeFileSync(join(DIST, 'index.html'), html, 'utf8');
  } else {
    const dir = join(DIST, routePath.replace(/^\//, ''));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html, 'utf8');
  }
}

// ---------------------------------------------------------------------------
// Per-route meta resolution
// ---------------------------------------------------------------------------

async function resolvePageMeta(slug, routePath, globalSeo) {
  const g = globalSeo || {};
  const fb = PAGE_FALLBACKS[slug] || {};

  // Try fetching CMS page
  const raw = await fetchJson(`${API_BASE}/cms/pages/${slug}`);
  // raw is the Page mongoose doc (or null if 404/error/draft)
  const page = raw && typeof raw === 'object' && raw.slug ? raw : null;

  const suffix = g.titleSuffix || SITE_DEFAULTS.titleSuffix;
  const rawTitle = page?.metaTitle || fb.metaTitle || page?.title || g.siteName || SITE_DEFAULTS.siteName;
  const title = rawTitle.includes(suffix) ? rawTitle : `${rawTitle} | ${suffix}`;

  const canonical = absoluteUrl(page?.canonicalUrl || routePath);

  return {
    title,
    description: page?.metaDescription || fb.metaDescription || g.siteDescription || SITE_DEFAULTS.siteDescription,
    robots:      page?.robotsDirective  || fb.robotsDirective  || 'index,follow',
    keywords:    page?.focusKeyword     || fb.focusKeyword     || '',
    canonical,
    ogImage:     absoluteUrl(page?.ogImage || g.defaultImage || SITE_DEFAULTS.defaultImage),
    ogType:      'website',
    jsonLd:      fb.jsonLd || null,
  };
}

// ---------------------------------------------------------------------------
// Dynamic route prerendering helper
// ---------------------------------------------------------------------------

async function prerenderDynamic(label, items, pathFn, metaFn, template) {
  let ok = 0;
  let failed = 0;
  for (const item of items) {
    const routePath = pathFn(item);
    process.stdout.write(`  ${routePath.padEnd(45)}`);
    try {
      const meta = metaFn(item);
      const html = injectIntoHtml(template, buildHeadBlock(meta));
      writeRouteHtml(routePath, html);
      console.log(`✓  "${meta.title}"`);
      ok++;
    } catch (err) {
      console.log(`✗  ${err.message}`);
      failed++;
    }
  }
  console.log(`  → ${label}: ${ok} written${failed ? `, ${failed} failed` : ''}`);
  return failed;
}

// ---------------------------------------------------------------------------
// Meta builders for dynamic types
// ---------------------------------------------------------------------------

function blogPostMeta(post, globalSeo) {
  const g = globalSeo || {};
  const suffix = g.titleSuffix || SITE_DEFAULTS.titleSuffix;
  const rawTitle = post.metaTitle || post.title || SITE_DEFAULTS.siteName;
  const title = rawTitle.includes(suffix) ? rawTitle : `${rawTitle} | ${suffix}`;
  const canonical = absoluteUrl(`/blog/${post.slug}`);
  const ogImage = absoluteUrl(post.ogImage || post.coverImage?.url || g.defaultImage || SITE_DEFAULTS.defaultImage);

  return {
    title,
    description: post.metaDescription || post.excerpt || g.siteDescription || SITE_DEFAULTS.siteDescription,
    robots: 'index,follow',
    keywords: Array.isArray(post.tags) ? post.tags.join(', ') : '',
    canonical,
    ogType: 'article',
    ogImage,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.metaDescription || post.excerpt || '',
        image: ogImage,
        url: canonical,
        datePublished: post.publishedAt || post.createdAt,
        dateModified: post.updatedAt,
        publisher: {
          '@type': 'Organization',
          name: g.siteName || SITE_DEFAULTS.siteName,
          url: g.siteUrl || SITE_URL,
        },
      },
    ],
  };
}

function carMeta(car, isHire, globalSeo) {
  const g = globalSeo || {};
  const suffix = g.titleSuffix || SITE_DEFAULTS.titleSuffix;
  const mode = isHire ? 'Hire' : 'Sale';
  const rawTitle = `${car.brand} ${car.model} ${car.year} for ${mode} in Ilorin`;
  const title = `${rawTitle} | ${suffix}`;
  const routePath = isHire ? `/car-hire/${car._id}` : `/cars/${car._id}`;
  const canonical = absoluteUrl(routePath);

  const primaryImage =
    (car.images || []).find((img) => img.isPrimary)?.url ||
    car.images?.[0]?.url ||
    g.defaultImage ||
    SITE_DEFAULTS.defaultImage;
  const ogImage = absoluteUrl(primaryImage);

  const description = car.description
    ? car.description.slice(0, 160) + (car.description.length > 160 ? '…' : '')
    : `${car.brand} ${car.model} ${car.year} available for ${mode.toLowerCase()} in Ilorin, Kwara State.`;

  const price = isHire ? car.pricePerDay : car.salePrice;

  return {
    title,
    description,
    robots: car.status === 'available' ? 'index,follow' : 'noindex,nofollow',
    keywords: `${car.brand} ${car.model} ${car.year} ${mode.toLowerCase()} Ilorin`,
    canonical,
    ogType: 'product',
    ogImage,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${car.brand} ${car.model} ${car.year}`,
        description,
        image: ogImage,
        url: canonical,
        brand: { '@type': 'Brand', name: car.brand },
        ...(price
          ? {
              offers: {
                '@type': 'Offer',
                price,
                priceCurrency: 'NGN',
                availability: 'https://schema.org/InStock',
              },
            }
          : {}),
      },
    ],
  };
}

function cmsCustomPageMeta(page, globalSeo) {
  const g = globalSeo || {};
  const suffix = g.titleSuffix || SITE_DEFAULTS.titleSuffix;
  const rawTitle = page.metaTitle || page.title || SITE_DEFAULTS.siteName;
  const title = rawTitle.includes(suffix) ? rawTitle : `${rawTitle} | ${suffix}`;
  const canonical = absoluteUrl(page.canonicalUrl || `/${page.slug}`);

  return {
    title,
    description: page.metaDescription || g.siteDescription || SITE_DEFAULTS.siteDescription,
    robots: page.robotsDirective || 'index,follow',
    keywords: page.focusKeyword || '',
    canonical,
    ogType: 'website',
    ogImage: absoluteUrl(page.ogImage || g.defaultImage || SITE_DEFAULTS.defaultImage),
    jsonLd: null,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

// Slugs already covered by the static ROUTES array — skip these in the
// CMS custom-pages loop to avoid overwriting with a less-specific version.
const STATIC_SLUGS = new Set(ROUTES.map((r) => r.slug));

async function main() {
  console.log('\n🔍 SEO Prerender — injecting per-route meta tags\n');

  // Read template once
  const template = readFileSync(join(DIST, 'index.html'), 'utf8');
  if (!template.includes('<!--SEO_HEAD_START-->')) {
    console.error('✗ index.html is missing <!--SEO_HEAD_START--> markers. Aborting.');
    process.exit(1);
  }

  // Fetch global SEO settings once (used as fallback for all pages)
  console.log(`  Fetching global SEO settings from ${API_BASE}…`);
  const globalRaw = await fetchJson(`${API_BASE}/cms/seo-settings`);
  const globalSeo = globalRaw && typeof globalRaw === 'object' ? globalRaw : null;
  if (!globalSeo) {
    console.warn('  ⚠  Could not fetch global SEO settings — using hardcoded defaults');
  }

  let totalFailed = 0;

  // ── Static CMS pages ──────────────────────────────────────────────────────
  console.log('\n── Static pages ──');
  let ok = 0;
  let failed = 0;
  for (const { path: routePath, slug } of ROUTES) {
    process.stdout.write(`  ${routePath.padEnd(35)}`);
    try {
      const meta = await resolvePageMeta(slug, routePath, globalSeo);
      const html = injectIntoHtml(template, buildHeadBlock(meta));
      writeRouteHtml(routePath, html);
      console.log(`✓  "${meta.title}"`);
      ok++;
    } catch (err) {
      console.log(`✗  ${err.message}`);
      failed++;
    }
  }
  console.log(`  → Static pages: ${ok} written${failed ? `, ${failed} failed` : ''}`);
  totalFailed += failed;

  // ── Blog posts ────────────────────────────────────────────────────────────
  console.log('\n── Blog posts ──');
  const blogData = await fetchJson(`${API_BASE}/blog/posts?limit=500`);
  const posts = blogData?.posts || [];
  if (posts.length === 0) {
    console.log('  ⚠  No published blog posts found or API unreachable — skipping');
  } else {
    totalFailed += await prerenderDynamic(
      'Blog posts',
      posts,
      (post) => `/blog/${post.slug}`,
      (post) => blogPostMeta(post, globalSeo),
      template
    );
  }

  // ── Cars ──────────────────────────────────────────────────────────────────
  console.log('\n── Cars ──');
  const carData = await fetchJson(`${API_BASE}/cars?limit=500`);
  const cars = carData?.cars || [];
  if (cars.length === 0) {
    console.log('  ⚠  No cars found or API unreachable — skipping');
  } else {
    // Sale cars → /cars/:id
    const saleCars = cars.filter((c) => c.type === 'sale');
    totalFailed += await prerenderDynamic(
      'Sale cars',
      saleCars,
      (car) => `/cars/${car._id}`,
      (car) => carMeta(car, false, globalSeo),
      template
    );

    // Rental cars → /car-hire/:id
    const rentalCars = cars.filter((c) => c.type === 'rental');
    totalFailed += await prerenderDynamic(
      'Rental cars',
      rentalCars,
      (car) => `/car-hire/${car._id}`,
      (car) => carMeta(car, true, globalSeo),
      template
    );
  }

  // ── CMS custom pages (non-system, non-static) ─────────────────────────────
  console.log('\n── CMS custom pages ──');
  const pagesData = await fetchJson(`${API_BASE}/cms/pages?limit=500`);
  const allPages = pagesData?.pages || [];
  const customPages = allPages.filter(
    (p) => !p.isSystemPage && p.status === 'published' && !STATIC_SLUGS.has(p.slug)
  );
  if (customPages.length === 0) {
    console.log('  ⚠  No custom CMS pages found — skipping');
  } else {
    totalFailed += await prerenderDynamic(
      'CMS custom pages',
      customPages,
      (page) => `/${page.slug}`,
      (page) => cmsCustomPageMeta(page, globalSeo),
      template
    );
  }

  console.log(`\n${totalFailed === 0 ? '✓ All routes prerendered successfully' : `✗ ${totalFailed} route(s) failed`}\n`);
  if (totalFailed > 0) process.exit(1);
}

main();
