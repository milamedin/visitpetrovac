import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ─── Sveltia/Decap CMS sometimes emits empty strings or null for unfilled
// optional fields. Strip them recursively before schema validation so
// optional/enum/reference/url fields don't blow up on empties.
const stripEmpties = (data: unknown): unknown => {
  if (Array.isArray(data)) return data.map(stripEmpties);
  // Plain objects only — leave Date, RegExp, and other class instances alone
  if (data && typeof data === 'object' && Object.getPrototypeOf(data) === Object.prototype) {
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      if (v === '' || v === null) continue;
      cleaned[k] = stripEmpties(v);
    }
    return cleaned;
  }
  return data;
};

// ─── i18n shape — populated by `npm run translate` ─────────────────
const translatedString = z.string().optional();
const localeKeys = ['en', 'ru', 'de', 'fr'] as const;
const localeOf = <T extends z.ZodRawShape>(shape: T) =>
  z.object(Object.fromEntries(localeKeys.map((l) => [l, z.object(shape).partial().optional()])) as {
    [K in (typeof localeKeys)[number]]: z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<T, {}>>>;
  }).partial().optional();

// `body_translations: { en: "..." }` — per-locale full markdown body
const bodyTranslations = z
  .object(Object.fromEntries(localeKeys.map((l) => [l, z.string().optional()])) as {
    [K in (typeof localeKeys)[number]]: z.ZodOptional<z.ZodString>;
  })
  .partial()
  .optional();

// Hash of source content used to invalidate stale translations
const sourceHash = z.string().optional();

const categories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/categories' }),
  schema: z.preprocess(stripEmpties, z.object({
    name: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    order: z.number().default(0),
    hero_image: z.string().optional(),
    translations: localeOf({ name: translatedString, description: translatedString }),
    source_hash: sourceHash,
  })),
});

const neighborhoods = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/neighborhoods' }),
  schema: z.preprocess(stripEmpties, z.object({
    name: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
    translations: localeOf({ name: translatedString, description: translatedString }),
    source_hash: sourceHash,
  })),
});

const owners = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/owners' }),
  schema: z.preprocess(stripEmpties, z.object({
    name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    photo: z.string().optional(),
    bio: z.string().optional(),
    languages: z.array(z.string()).default(['sr']),
    translations: localeOf({ bio: translatedString }),
    source_hash: sourceHash,
  })),
});

// ─── Shared base for all 5 listing collections ──────────────────────
// Contact lives ONLY on owner — listings get owner.contact via Astro fallback.
// `website` (per-listing) stays as a free-standing field for places that
// have their own URL (e.g., hotel booking page) that differs from the owner.
const baseListingFields = {
  title: z.string(),
  owner: reference('owners').optional(),
  excerpt: z.string().max(200),
  price_from: z.number().optional(),
  price_unit: z.enum(['per_night', 'per_person', 'per_day', 'per_meal', 'fixed']).default('per_night'),
  premium: z.boolean().default(false),
  created_at: z.coerce.date().optional(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  capacity: z.number().optional(),
  website: z.string().url().optional(),
  location: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    address: z.string().optional(),
  }).optional(),
  rating: z.number().min(0).max(5).optional(),
  booking_url: z.string().url().optional(),
  youtube_url: z.string().url().optional(),
  neighborhood: reference('neighborhoods').optional(),
  published: z.boolean().default(true),
  translations: localeOf({
    title: translatedString,
    excerpt: translatedString,
    amenities: z.array(z.string()).optional(),
  }),
  body_translations: bodyTranslations,
  source_hash: sourceHash,
};

const smjestaj = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/smjestaj' }),
  schema: z.preprocess(stripEmpties, z.object({
    ...baseListingFields,
    accommodation_type: z.enum(['hotel', 'vila', 'kuca', 'apartman', 'soba']).optional(),
    units: z
      .array(
        z.object({
          name: z.string(),
          capacity: z.number().int().min(1),
          price_from: z.number().optional(),
          description: z.string().optional(),
          image: z.string().optional(),
        }),
      )
      .optional(),
  })),
});

const restorani = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/restorani' }),
  schema: z.preprocess(stripEmpties, z.object({
    ...baseListingFields,
    restaurant_type: z
      .enum(['restoran', 'konoba', 'pizzeria', 'slasticarna', 'bar', 'beach-bar'])
      .optional(),
    menu_url: z.string().optional(),
  })),
});

const iskustva = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/iskustva' }),
  schema: z.preprocess(stripEmpties, z.object({
    ...baseListingFields,
    activity_type: z
      .enum(['brod', 'kajak-sup', 'ronjenje', 'hiking', 'ribolov', 'kultura', 'gastro', 'foto'])
      .optional(),
  })),
});

const rentacar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rentacar' }),
  schema: z.preprocess(stripEmpties, z.object({
    ...baseListingFields,
  })),
});

const trgovina = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trgovina' }),
  schema: z.preprocess(stripEmpties, z.object({
    ...baseListingFields,
    shop_type: z
      .enum(['apoteka', 'prodavnica', 'pijaca', 'market', 'butik', 'suveniri', 'ostalo'])
      .optional(),
  })),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.preprocess(stripEmpties, z.object({
    title: z.string(),
    excerpt: z.string().max(300),
    cover_image: z.string().optional(),
    published_at: z.coerce.date(),
    author: z.string().default('VisitPetrovac'),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(true),
    translations: localeOf({ title: translatedString, excerpt: translatedString }),
    body_translations: bodyTranslations,
    source_hash: sourceHash,
  })),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.preprocess(stripEmpties, z.object({
    title: z.string(),
    show_in_menu: z.boolean().default(false),
    show_in_footer: z.boolean().default(false),
    order: z.number().default(0),
    translations: localeOf({ title: translatedString }),
    body_translations: bodyTranslations,
    source_hash: sourceHash,
  })),
});

export const collections = {
  categories,
  neighborhoods,
  owners,
  smjestaj,
  restorani,
  iskustva,
  rentacar,
  trgovina,
  posts,
  pages,
};
// URL slug → collection mapping lives in src/lib/categories.ts (kept out
// of this file to avoid circular import with src/lib/listings.ts).
