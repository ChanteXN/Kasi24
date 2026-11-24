import { supabase } from '../lib/supabaseClient';
import { toError } from './api';

export const ENQUIRY_MESSAGE_MAX = 2000;

/**
 * Sends an enquiry to a listing's provider. Requires a signed-in user: the database policy only
 * allows customer_id = the caller, on a public listing they do not own. It does not reserve a stay.
 */
export async function sendEnquiry({ listingId, message }) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) {
    const err = new Error('Please log in to contact a provider.');
    err.status = 401;
    throw err;
  }

  // No .select() after insert: customers can read their own enquiries, but we only need success here.
  const { error } = await supabase.from('enquiries').insert({
    listing_id: listingId,
    customer_id: userId,
    message: message.trim(),
  });

  if (error) {
    if (error.code === '42501') {
      throw new Error('You cannot send an enquiry for this listing (it may no longer be available, or it is your own).');
    }
    throw toError(error);
  }
}

/** The signed-in user's own enquiries (RLS limits the rows). */
export async function getMyEnquiries() {
  const { data, error } = await supabase
    .from('enquiries')
    .select('id, listing_id, message, status, created_at')
    .order('created_at', { ascending: false });
  if (error) throw toError(error);
  return data;
}
