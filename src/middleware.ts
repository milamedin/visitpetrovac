import { defineMiddleware } from 'astro:middleware';
import { parseLocaleFromPath, defaultLocale } from './i18n/locales';

export const onRequest = defineMiddleware(async (context, next) => {
  // Force apex domain — www.visitpetrovac.com → visitpetrovac.com (301).
  // Fixes the 5xx on the www subdomain reported by Site Audit.
  const host = context.request.headers.get('host') || '';
  if (host.startsWith('www.')) {
    const apex = `https://${host.slice(4)}${context.url.pathname}${context.url.search}`;
    return Response.redirect(apex, 301);
  }

  // Skip if already resolved (a previous middleware pass set it before rewrite).
  if (!context.locals.locale) {
    const { locale, pathWithoutLocale } = parseLocaleFromPath(context.url.pathname);
    context.locals.locale = locale;
    context.locals.pathWithoutLocale = pathWithoutLocale;

    if (locale !== defaultLocale && context.url.pathname !== pathWithoutLocale) {
      // Rewrite strips the locale prefix; locals carry the locale into the page.
      return context.rewrite(pathWithoutLocale + context.url.search);
    }
  }

  const response = await next();

  // Security headers (HSTS, X-Content-Type-Options, Referrer-Policy)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
});
