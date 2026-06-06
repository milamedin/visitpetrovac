export const locales = ['sr', 'en', 'ru', 'de', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'sr';

export const localeMeta: Record<Locale, { name: string; nativeName: string; displayCode: string; flag: string; htmlLang: string; ogLocale: string }> = {
  sr: { name: 'Montenegrin', nativeName: 'Crnogorski', displayCode: 'ME', flag: '🇲🇪', htmlLang: 'sr-Latn-ME', ogLocale: 'sr_ME' },
  en: { name: 'English', nativeName: 'English', displayCode: 'EN', flag: '🇬🇧', htmlLang: 'en', ogLocale: 'en_US' },
  ru: { name: 'Russian', nativeName: 'Русский', displayCode: 'RU', flag: '🇷🇺', htmlLang: 'ru', ogLocale: 'ru_RU' },
  de: { name: 'German', nativeName: 'Deutsch', displayCode: 'DE', flag: '🇩🇪', htmlLang: 'de', ogLocale: 'de_DE' },
  fr: { name: 'French', nativeName: 'Français', displayCode: 'FR', flag: '🇫🇷', htmlLang: 'fr', ogLocale: 'fr_FR' },
};

export function isLocale(s: string | undefined): s is Locale {
  return !!s && (locales as readonly string[]).includes(s);
}

/**
 * Extract locale from a URL pathname. Default locale ('sr') has no prefix.
 * Returns { locale, pathWithoutLocale } where pathWithoutLocale always starts with '/'.
 */
export function parseLocaleFromPath(pathname: string): { locale: Locale; pathWithoutLocale: string } {
  const match = pathname.match(/^\/([a-z]{2})(?=\/|$)/);
  if (match && isLocale(match[1]) && match[1] !== defaultLocale) {
    return {
      locale: match[1],
      pathWithoutLocale: pathname.slice(match[0].length) || '/',
    };
  }
  return { locale: defaultLocale, pathWithoutLocale: pathname };
}

/**
 * Build a URL for a given locale and path. Default locale has no prefix.
 * `path` should start with '/'.
 */
export function localizePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  if (clean === '/') return `/${locale}`;
  return `/${locale}${clean}`;
}
