import { defineMiddleware } from 'astro:middleware';
import { parseLocaleFromPath, defaultLocale } from './i18n/locales';

export const onRequest = defineMiddleware(async (context, next) => {
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

  return next();
});
