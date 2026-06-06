import MarkdownIt from 'markdown-it';
import type { Locale } from '../i18n/locales';

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

// Force any linkified bare-domain refs (e.g. "VisitPetrovac.com" in body text)
// to resolve as https:// rather than the default http://. Prevents
// "HTTP links on HTTPS site" warnings from auto-linkified plain-text mentions.
const _originalNormalize = md.normalizeLink.bind(md);
md.normalizeLink = (url: string) => {
  if (url.startsWith('http://')) {
    return _originalNormalize('https://' + url.slice(7));
  }
  return _originalNormalize(url);
};

/**
 * Apply per-locale frontmatter translations to a content entry, returning a
 * shallow-cloned copy. Astro's content collection cache shares entry objects
 * across requests, so MUTATING `data` would leak the locale of the first
 * request into all subsequent ones — clone instead.
 *
 * Falls back silently to SR fields when a translation is missing.
 */
export function applyTranslation<
  T extends { data: Record<string, any> & { translations?: Record<string, any> } },
>(entry: T, locale: Locale): T {
  if (locale === 'sr' || !entry.data.translations) return entry;
  const tr = entry.data.translations[locale];
  if (!tr) return entry;

  const cloned = { ...entry, data: { ...entry.data } } as T;
  for (const key of Object.keys(tr)) {
    const value = tr[key];
    if (value !== undefined && value !== null && value !== '') {
      cloned.data[key] = value;
    }
  }
  return cloned;
}

/**
 * If `body_translations[locale]` exists, render it to HTML.
 * Otherwise return null — caller should fall back to Astro's `render(entry)`.
 */
export function renderLocalizedBody(
  entry: { data: { body_translations?: Record<string, string | undefined> } },
  locale: Locale,
): string | null {
  if (locale === 'sr' || !entry.data.body_translations) return null;
  const body = entry.data.body_translations[locale];
  if (!body || body.trim().length === 0) return null;
  return md.render(body);
}
