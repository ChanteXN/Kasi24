import { supabase } from '../lib/supabaseClient';
import { callApi, toError } from './api';

// Provider workflows run in the `api` Edge Function (it checks account status, role and ownership).
// Uploaded files must be stored under "<user id>/..." in the relevant storage bucket first.

/** { display_name, business_name?, public_bio?, legal_name?, document_type?, identity_document_path? } */
export const onboardProvider = (details) => callApi('provider/onboard', details);

/**
 * { area_id, kind, title, description, monthly_rent_zar, deposit_zar?, max_occupants?, available_from?,
 *   amenity_codes?: string[], address?: {...}, evidence?: [{ evidence_type, object_path }] }
 */
export const createListing = (listing) => callApi('listings', listing);

/** Moves a draft/rejected listing to pending review. Needs an address and authority-to-let evidence. */
export const submitListing = (listingId) => callApi(`listings/${listingId}/submit`);

// Staff only (moderator/admin role) - { decision: 'approve' | 'reject', reason, notes? }
export const reviewListing = (listingId, decision, reason) => callApi(`listings/${listingId}/review`, { decision, reason });
export const reviewEvidence = (evidenceId, decision, notes) => callApi(`evidence/${evidenceId}/review`, { decision, notes });
export const reviewProvider = (providerId, decision, notes) => callApi(`providers/${providerId}/review`, { decision, notes });

// ---------- reads (Row Level Security: a provider sees their own provider row and listings in any status) ----------

/** The signed-in user's provider profile, or null if they have not onboarded yet. */
export async function getMyProvider(userId) {
  const { data, error } = await supabase
    .from('providers')
    .select('id, display_name, business_name, public_bio, verification_status')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw toError(error);
  return data;
}

export async function getMyListings(providerId) {
  const { data, error } = await supabase
    .from('listings')
    .select('id, title, kind, monthly_rent_zar, status, availability, created_at, area:areas ( name )')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false });
  if (error) throw toError(error);
  return data;
}

export async function getAmenities() {
  const { data, error } = await supabase.from('amenities').select('code, label').order('label');
  if (error) throw toError(error);
  return data;
}

// ---------- document uploads ----------

export const VERIFICATION_BUCKET = 'verification-documents';
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // matches the bucket limit
export const ALLOWED_UPLOAD_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export const listingStatusLabel = (status) =>
  ({
    draft: 'Draft - not yet submitted',
    pending_review: 'Awaiting review',
    approved: 'Live',
    rejected: 'Rejected - update and resubmit',
    suspended: 'Suspended',
    archived: 'Archived',
  })[status] ?? status;

/** Returns an error message, or null when the file is acceptable. */
export function validateUpload(file) {
  if (!file) return 'Please choose a file.';
  if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) return 'Upload a JPG, PNG or PDF file.';
  if (file.size > MAX_UPLOAD_BYTES) return 'The file is too large (10 MB maximum).';
  return null;
}

export const safeFileName = (name) => name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80) || 'file';

/** Uploads to the private verification bucket under the caller's own folder and returns the object path. */
export async function uploadVerificationFile(userId, file) {
  const problem = validateUpload(file);
  if (problem) throw new Error(problem);
  const objectPath = `${userId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error } = await supabase.storage.from(VERIFICATION_BUCKET).upload(objectPath, file, { contentType: file.type });
  if (error) throw toError(error, 'Could not upload the file.');
  return objectPath;
}
