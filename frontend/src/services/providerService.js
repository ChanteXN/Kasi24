import { callApi } from './api';

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
