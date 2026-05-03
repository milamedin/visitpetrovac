import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    order: z.number().default(0),
    hero_image: z.string().optional(),
    translations: localeOf({ name: translatedString, description: translatedString }),
    source_hash: sourceHash,
  }),
});

const neighborhoods = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/neighborhoods' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
    translations: localeOf({ name: translatedString, description: translatedString }),
    source_hash: sourceHash,
  }),
});

const owners = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/owners' }),
  schema: z.object({
    name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    photo: z.string().optional(),
    bio: z.string().optional(),
    languages: z.array(z.string()).default(['sr']),
    translations: localeOf({ bio: translatedString }),
    source_hash: sourceHash,
  }),
});

const listings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/listings' }),
  schema: z.object({
    title: z.string(),
    category: reference('categories'),
    owner: reference('owners').optional(),
    excerpt: z.string().max(200),
    price_from: z.number().optional(),
    price_unit: z.enum(['per_night', 'per_person', 'per_day', 'per_meal', 'fixed']).default('per_night'),
    premium: z.boolean().default(false),
    amenities: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    capacity: z.number().optional(),
    contact: z.object({
      phone: z.string().optional(),
      whatsapp: z.string().optional(),
      email: z.string().email().optional(),
      website: z.string().url().optional(),
    }),
    location: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
      address: z.string().optional(),
    }).optional(),
    rating: z.number().min(0).max(5).optional(),
    booking_url: z.string().url().optional(),
    youtube_url: z.string().url().optional(),
    accommodation_type: z.enum(['hotel', 'vila', 'kuca', 'apartman', 'soba']).optional(),
    restaurant_type: z
      .enum(['restoran', 'konoba', 'pizzeria', 'slasticarna', 'bar', 'beach-bar'])
      .optional(),
    activity_type: z
      .enum(['brod', 'kajak-sup', 'ronjenje', 'hiking', 'ribolov', 'kultura', 'gastro', 'foto'])
      .optional(),
    neighborhood: reference('neighborhoods').optional(),
    menu_url: z.string().optional(),
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
    published: z.boolean().default(true),
    translations: localeOf({
      title: translatedString,
      excerpt: translatedString,
      amenities: z.array(z.string()).optional(),
    }),
    body_translations: bodyTranslations,
    source_hash: sourceHash,
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
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
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    show_in_menu: z.boolean().default(false),
    show_in_footer: z.boolean().default(false),
    order: z.number().default(0),
    translations: localeOf({ title: translatedString }),
    body_translations: bodyTranslations,
    source_hash: sourceHash,
  }),
});

export const collections = { categories, neighborhoods, owners, listings, posts, pages };
