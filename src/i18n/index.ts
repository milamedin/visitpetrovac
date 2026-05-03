import {
  parseLocaleFromPath,
  localizePath,
  localeMeta,
  locales,
  defaultLocale,
  isLocale,
  type Locale,
} from './locales';
import { t as _t, type StringKey } from './strings';

export interface I18n {
  locale: Locale;
  t: (key: StringKey) => string;
  /** Build a URL for the current locale. */
  url: (path: string) => string;
  /** Build a URL for a specific locale (used by language switcher). */
  urlFor: (path: string, locale: Locale) => string;
  /** Path of the current page without locale prefix (for hreflang). */
  pathWithoutLocale: string;
}

/**
 * Resolve i18n context from the Astro global. Use at the top of every .astro file:
 *   const { t, locale, url } = useI18n(Astro);
 *
 * Reads from `Astro.locals.locale` (set by middleware) when available;
 * otherwise falls back to URL parsing.
 */
export function useI18n(astro: {
  url: URL;
  locals?: { locale?: Locale; pathWithoutLocale?: string };
}): I18n {
  let locale: Locale = defaultLocale;
  let pathWithoutLocale = astro.url.pathname;

  if (astro.locals?.locale && isLocale(astro.locals.locale)) {
    locale = astro.locals.locale;
    pathWithoutLocale = astro.locals.pathWithoutLocale ?? pathWithoutLocale;
  } else {
    const parsed = parseLocaleFromPath(astro.url.pathname);
    locale = parsed.locale;
    pathWithoutLocale = parsed.pathWithoutLocale;
  }

  return {
    locale,
    t: (key) => _t(key, locale),
    url: (path) => localizePath(path, locale),
    urlFor: (path, l) => localizePath(path, l),
    pathWithoutLocale,
  };
}

export {
  parseLocaleFromPath,
  localizePath,
  localeMeta,
  locales,
  defaultLocale,
  isLocale,
  type Locale,
  type StringKey,
};
