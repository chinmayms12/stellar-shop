import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lykoxkuxwhbwgvyyraqy.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_RaQIld0mkSTzNGFg2FLrEQ_UkQmoeOH';

const envUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
const envKey = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const supabaseDirectUrl = envUrl || SUPABASE_URL;
const publishableKey = envKey || SUPABASE_PUBLISHABLE_KEY;

export const supabaseEnabled = Boolean(supabaseDirectUrl && publishableKey);

export const supabase = supabaseEnabled
  ? createClient(supabaseDirectUrl, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      global: { headers: { 'X-Client-Info': 'stellar-shop-web' } },
    })
  : null;
