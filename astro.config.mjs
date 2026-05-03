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
  // i18n is handled entirely by src/middleware.ts which rewrites
  // /en/foo → /foo and stashes the locale on Astro.locals.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
