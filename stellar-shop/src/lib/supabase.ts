import { createClient } from '@supabase/supabase-js';

// Production values supplied for this deployment. Vercel VITE_* variables take precedence.
const url = String(import.meta.env.VITE_SUPABASE_URL || 'https://lykoxkuxwhbwgvyyraqy.supabase.co').trim().replace(/\/$/, '');
const anonKey = String(
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_RaQIld0mkSTzNGFg2FLrEQ_UkQmoeOH'
).trim();

export const supabaseEnabled = Boolean(url && anonKey);

// Route Supabase HTTP traffic through the same Vercel origin. This avoids browser/ISP
// DNS or connectivity problems reaching *.supabase.co directly while keeping the
// publishable key as the only browser-visible credential.
const useProxy = String(import.meta.env.VITE_USE_SUPABASE_PROXY ?? 'true').toLowerCase() !== 'false';
const proxyOrigin = `${window.location.origin}/api/supabase`;

const proxiedFetch: typeof fetch = async (input, init) => {
  const original = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  const parsed = new URL(original);
  const targetPrefix = `${url}/`;
  if (!useProxy || !original.startsWith(targetPrefix)) return fetch(input, init);

  const proxyUrl = `${proxyOrigin}/${parsed.pathname.replace(/^\/+/, '')}${parsed.search}`;
  const requestInit: RequestInit = { ...(init || {}) };
  if (input instanceof Request && !init) return fetch(proxyUrl, input);
  return fetch(proxyUrl, requestInit);
};

export const supabase = supabaseEnabled
  ? createClient(url, anonKey, {
      global: { fetch: proxiedFetch },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const supabaseConfig = {
  url,
  keyConfigured: Boolean(anonKey),
  project: url.replace(/^https?:\/\//, '').split('.')[0],
  proxyEnabled: useProxy,
};
