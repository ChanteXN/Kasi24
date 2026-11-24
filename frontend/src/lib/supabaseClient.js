import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Publishable key (sb_publishable_...) is public by design. The legacy VITE_SUPABASE_ANON_KEY still works.
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured) {
  console.warn('Supabase env vars missing - copy frontend/.env.example to frontend/.env.local');
}

// One client for everything: auth, reads under Row Level Security, and the `api` Edge Function.
export const supabase = createClient(supabaseUrl ?? 'http://localhost:54321', supabaseKey ?? 'missing-key');

export const LISTING_IMAGE_BUCKET = 'public-listing-images';

/** Public URL for an approved listing photo (bucket is public; only moderated images are readable). */
export function listingImageUrl(objectPath) {
  return supabase.storage.from(LISTING_IMAGE_BUCKET).getPublicUrl(objectPath).data.publicUrl;
}
