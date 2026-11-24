import { supabase } from '../lib/supabaseClient';

/**
 * Calls a route on the `api` Supabase Edge Function (trusted workflows: provider onboarding,
 * listing create/submit, staff reviews). The signed-in user's JWT is attached automatically.
 * Always POST. Example: callApi('listings/<id>/submit')
 */
export async function callApi(path, body = {}) {
  const { data, error } = await supabase.functions.invoke(`api/${path}`, { body });
  if (!error) return data;

  const err = new Error(error.message);
  err.status = error.context?.status;
  // The function replies { error: "..." } with a readable message on 4xx.
  const payload = await error.context?.json?.().catch(() => null);
  if (payload?.error) err.message = payload.error;
  throw err;
}

/** Turns a Supabase/PostgREST error into a plain Error with a friendly message. */
export function toError(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return null;
  const e = new Error(error.message || fallback);
  e.code = error.code;
  return e;
}
