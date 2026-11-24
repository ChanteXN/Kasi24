import { supabase, listingImageUrl } from '../lib/supabaseClient';
import { toError } from './api';

// RLS already limits everyone (including signed-out visitors) to approved, available, non-fictional listings.
const LISTING_SELECT = `
  id, title, description, kind, monthly_rent_zar, deposit_zar, availability,
  available_from, max_occupants, last_availability_confirmed_at,
  area:areas ( id, name, parent_area_id ),
  provider:providers ( id, display_name, business_name, public_bio, verification_status ),
  amenities:listing_amenities ( amenity:amenities ( code, label ) ),
  images:listing_images ( id, object_path, alt_text, sort_order )
`;

export const LISTING_KINDS = [
  { value: 'backyard_room', label: 'Backyard room' },
  { value: 'shack', label: 'Shack' },
  { value: 'room_in_house', label: 'Room in a house' },
  { value: 'other', label: 'Other' },
];

export const kindLabel = (kind) => LISTING_KINDS.find((k) => k.value === kind)?.label ?? 'Other';

/** Flattens the nested PostgREST shape into what the UI needs. */
export function normaliseListing(row) {
  return {
    ...row,
    amenities: (row.amenities ?? []).map((a) => a.amenity).filter(Boolean),
    images: (row.images ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({ ...img, url: listingImageUrl(img.object_path) })),
  };
}

export async function getAreas() {
  const { data, error } = await supabase.from('areas').select('id, name, parent_area_id').order('name');
  if (error) throw toError(error);
  return data;
}

/** Ids of an area plus its children (searching "Khayelitsha" should include Site B and Site C). */
export function areaIdsWithChildren(areas, areaId) {
  return areas.filter((a) => a.id === areaId || a.parent_area_id === areaId).map((a) => a.id);
}

/** Finds an area by (partial, case-insensitive) name, e.g. from the landing-page search box. */
export function findAreaByName(areas, name) {
  const needle = name?.trim().toLowerCase();
  if (!needle) return null;
  return areas.find((a) => a.name.toLowerCase() === needle) ?? areas.find((a) => a.name.toLowerCase().includes(needle)) ?? null;
}

/**
 * @param {{ areaIds?: string[], kind?: string, maxRent?: number, sort?: 'newest'|'price_asc'|'price_desc' }} filters
 */
export async function searchListings({ areaIds, kind, maxRent, sort = 'newest' } = {}) {
  let query = supabase.from('listings').select(LISTING_SELECT);
  if (areaIds?.length) query = query.in('area_id', areaIds);
  if (kind) query = query.eq('kind', kind);
  if (maxRent) query = query.lte('monthly_rent_zar', maxRent);

  if (sort === 'price_asc') query = query.order('monthly_rent_zar', { ascending: true });
  else if (sort === 'price_desc') query = query.order('monthly_rent_zar', { ascending: false });
  else query = query.order('published_at', { ascending: false, nullsFirst: false });

  const { data, error } = await query;
  if (error) throw toError(error);
  return data.map(normaliseListing);
}

export async function getListing(id) {
  const { data, error } = await supabase.from('listings').select(LISTING_SELECT).eq('id', id).maybeSingle();
  if (error) throw toError(error);
  return data ? normaliseListing(data) : null;
}

export async function getListingsByIds(ids) {
  if (!ids?.length) return [];
  const { data, error } = await supabase.from('listings').select(LISTING_SELECT).in('id', ids);
  if (error) throw toError(error);
  return data.map(normaliseListing);
}
