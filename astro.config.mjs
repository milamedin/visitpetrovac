// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://visitpetrovac.com',
  output: 'server',
  adapter: cloudflare({
    imageService: 'compile',
  }),
  integrations: [],
  // 301 redirects for renamed slugs (preserves SEO equity)
  redirects: {
    '/aktivnosti': '/iskustva',
    '/aktivnosti/[slug]': '/iskustva/[slug]',
    '/en/aktivnosti': '/en/iskustva',
    '/en/aktivnosti/[slug]': '/en/iskustva/[slug]',
    '/ru/aktivnosti': '/ru/iskustva',
    '/ru/aktivnosti/[slug]': '/ru/iskustva/[slug]',
    '/de/aktivnosti': '/de/iskustva',
    '/de/aktivnosti/[slug]': '/de/iskustva/[slug]',
    '/fr/aktivnosti': '/fr/iskustva',
    '/fr/aktivnosti/[slug]': '/fr/iskustva/[slug]',
  },
  // i18n is handled entirely by src/middleware.ts which rewrites
  // /en/foo → /foo and stashes the locale on Astro.locals.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
