import { supabase } from '../lib/supabaseClient';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

/** Calls the Java backend, attaching the Supabase access token when signed in. */
export async function apiRequest(path, options = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(body?.message ?? `Request failed (${response.status})`);
    error.status = response.status;
    error.fieldErrors = body?.fieldErrors ?? {};
    throw error;
  }
  return body;
}
