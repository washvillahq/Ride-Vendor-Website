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
const PAGE_FALLBACKS = {
  logistics: {
    metaTitle: 'Bike Delivery in Ilorin, Kwara | Same-Day Last-Mile Delivery',
    metaDescription:
      'Book same-day bike delivery in Ilorin, Kwara State with Ride Vendor Logistics. Fast pickup, secure last-mile delivery, and WhatsApp booking for businesses and individuals.',
    focusKeyword:
      'bike delivery in Ilorin, same day delivery Ilorin, last mile delivery Kwara, dispatch rider Ilorin',
    robotsDirective: 'index,follow',
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
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

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

  let ok = 0;
  let failed = 0;

  for (const { path: routePath, slug } of ROUTES) {
    process.stdout.write(`  ${routePath.padEnd(30)}`);
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

  console.log(`\n${ok} routes prerendered${failed ? `, ${failed} failed` : ''}\n`);
  if (failed > 0) process.exit(1);
}

main();
