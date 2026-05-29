// Listings now live in 5 separate Astro collections (smjestaj, restorani,
// iskustva, rentacar, trgovina). These helpers give the rest of the app a
// single API to query across all of them.

import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import {
  CATEGORY_TO_COLLECTION,
  COLLECTION_TO_CATEGORY,
  collectionFor as _collectionFor,
  type CategorySlug,
  type ListingCollection,
} from './categories';

export { collectionFor } from './categories';
export type { CategorySlug, ListingCollection } from './categories';

export type AnyListing =
  | CollectionEntry<'smjestaj'>
  | CollectionEntry<'restorani'>
  | CollectionEntry<'iskustva'>
  | CollectionEntry<'rentacar'>
  | CollectionEntry<'trgovina'>;

// Add `categorySlug` (URL part — e.g. 'rent-a-car') so templates don't have
// to map collection ↔ slug again.
export type ListingWithCategory = AnyListing & { categorySlug: CategorySlug };

function annotate(entries: AnyListing[], collection: ListingCollection): ListingWithCategory[] {
  const cat = COLLECTION_TO_CATEGORY[collection];
  return entries.map((e) => Object.assign(e, { categorySlug: cat }));
}

/** All published listings across all 5 categories, with categorySlug annotated. */
export async function getAllListings(): Promise<ListingWithCategory[]> {
  const collections: ListingCollection[] = ['smjestaj', 'restorani', 'iskustva', 'rentacar', 'trgovina'];
  const buckets = await Promise.all(
    collections.map(async (c) => {
      const items = await getCollection(c, ({ data }) => data.published !== false);
      return annotate(items as AnyListing[], c);
    }),
  );
  return buckets.flat();
}

/** Listings for one category (by URL slug, e.g. 'rent-a-car'). */
export async function getListingsByCategory(
  categorySlug: string,
): Promise<ListingWithCategory[]> {
  const col = _collectionFor(categorySlug);
  if (!col) return [];
  const items = await getCollection(col, ({ data }) => data.published !== false);
  return annotate(items as AnyListing[], col);
}

/** Single listing by category slug + listing slug. Returns null if not found. */
export async function getListing(
  categorySlug: string,
  slug: string,
): Promise<ListingWithCategory | null> {
  const col = _collectionFor(categorySlug);
  if (!col) return null;
  const entry = (await getEntry(col, slug)) as AnyListing | undefined;
  if (!entry) return null;
  return Object.assign(entry, { categorySlug: COLLECTION_TO_CATEGORY[col] });
}

/**
 * Sort: Premium first, then by created_at descending (newest first).
 * Listings without created_at sort last among non-premium.
 */
export function sortPremiumThenNewest<T extends AnyListing>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ap = (a.data as any).premium ? 1 : 0;
    const bp = (b.data as any).premium ? 1 : 0;
    if (ap !== bp) return bp - ap;
    const at = (a.data as any).created_at ? new Date((a.data as any).created_at).getTime() : 0;
    const bt = (b.data as any).created_at ? new Date((b.data as any).created_at).getTime() : 0;
    return bt - at;
  });
}
