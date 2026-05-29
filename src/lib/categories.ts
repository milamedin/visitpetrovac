// URL slug → Astro collection name.
// Lives outside content.config.ts to avoid circular imports (Astro loads
// content.config.ts in a special phase and importing it from runtime code
// can hang the build).

export const CATEGORY_TO_COLLECTION = {
  smjestaj: 'smjestaj',
  restorani: 'restorani',
  iskustva: 'iskustva',
  'rent-a-car': 'rentacar',
  trgovina: 'trgovina',
} as const;

export type CategorySlug = keyof typeof CATEGORY_TO_COLLECTION;
export type ListingCollection = (typeof CATEGORY_TO_COLLECTION)[CategorySlug];

export const ALL_CATEGORY_SLUGS = Object.keys(CATEGORY_TO_COLLECTION) as CategorySlug[];

export function collectionFor(categorySlug: string): ListingCollection | null {
  return (CATEGORY_TO_COLLECTION as Record<string, ListingCollection>)[categorySlug] ?? null;
}

export const COLLECTION_TO_CATEGORY: Record<ListingCollection, CategorySlug> = {
  smjestaj: 'smjestaj',
  restorani: 'restorani',
  iskustva: 'iskustva',
  rentacar: 'rent-a-car',
  trgovina: 'trgovina',
};
