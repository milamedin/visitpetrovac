import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { locales, defaultLocale, localeMeta, localizePath } from '../i18n/locales';

export const prerender = false;

const ROOT = 'https://visitpetrovac.com';

interface Url {
  path: string;
  lastmod?: string;
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority?: number;
}

function buildUrl(u: Url): string {
  const tags: string[] = [];
  // Canonical = default locale
  const canonical = ROOT + localizePath(u.path, defaultLocale);
  tags.push(`<loc>${canonical}</loc>`);
  if (u.lastmod) tags.push(`<lastmod>${u.lastmod}</lastmod>`);
  if (u.changefreq) tags.push(`<changefreq>${u.changefreq}</changefreq>`);
  if (u.priority !== undefined) tags.push(`<priority>${u.priority.toFixed(1)}</priority>`);
  // hreflang alternates for every locale + x-default
  for (const l of locales) {
    const href = ROOT + localizePath(u.path, l);
    tags.push(`<xhtml:link rel="alternate" hreflang="${localeMeta[l].htmlLang}" href="${href}"/>`);
  }
  tags.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${canonical}"/>`);
  return `<url>${tags.join('')}</url>`;
}

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().slice(0, 10);

  const urls: Url[] = [
    { path: '/', changefreq: 'weekly', priority: 1.0, lastmod: today },
    { path: '/sve', changefreq: 'weekly', priority: 0.8, lastmod: today },
    { path: '/postani-partner', changefreq: 'monthly', priority: 0.5, lastmod: today },
    // Subcategory landing pages (P3a — entity SEO targeting)
    { path: '/restorani/pizzerije', changefreq: 'weekly', priority: 0.8, lastmod: today },
    { path: '/restorani/konobe', changefreq: 'weekly', priority: 0.8, lastmod: today },
    { path: '/restorani/riblji', changefreq: 'weekly', priority: 0.8, lastmod: today },
    { path: '/kafici', changefreq: 'weekly', priority: 0.8, lastmod: today },
    { path: '/izleti', changefreq: 'weekly', priority: 0.8, lastmod: today },
  ];

  const categories = await getCollection('categories');
  for (const cat of categories) {
    urls.push({ path: `/${cat.id}`, changefreq: 'weekly', priority: 0.8, lastmod: today });
  }

  const { getAllListings } = await import('../lib/listings');
  const listings = await getAllListings();
  for (const listing of listings) {
    urls.push({
      path: `/${listing.categorySlug}/${listing.id}`,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: today,
    });
  }

  try {
    const posts = await getCollection('posts', ({ data }) => data.published !== false);
    for (const post of posts) {
      urls.push({
        path: `/blog/${post.id}`,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: post.data.published_at.toISOString().slice(0, 10),
      });
    }
    if (posts.length > 0) {
      urls.push({ path: '/blog', changefreq: 'weekly', priority: 0.7, lastmod: today });
    }
  } catch {
    /* empty */
  }

  try {
    const pages = await getCollection('pages');
    for (const page of pages) {
      urls.push({ path: `/info/${page.id}`, changefreq: 'yearly', priority: 0.4, lastmod: today });
    }
  } catch {
    /* empty */
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urls.map(buildUrl).join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
