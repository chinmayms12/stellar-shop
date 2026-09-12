# Stellar Shop authentication — final deployment fix

This version uses the supplied Supabase project and a same-origin Vercel proxy.

Supabase project:
- https://lykoxkuxwhbwgvyyraqy.supabase.co

Production site:
- https://stellar-shop-sigma.vercel.app

The browser talks to `/api/supabase/*`, and the Vercel function forwards requests to the Supabase project. This avoids browser CORS/DNS failures and safely handles empty HTTP responses without calling JSON parsing on an empty body.

## Vercel environment variables

Set these for Production (and Preview if you want preview auth):

- `VITE_SUPABASE_URL=https://lykoxkuxwhbwgvyyraqy.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_RaQIld0mkSTzNGFg2FLrEQ_UkQmoeOH`
- `VITE_SUPABASE_ANON_KEY=sb_publishable_RaQIld0mkSTzNGFg2FLrEQ_UkQmoeOH`
- `VITE_SITE_URL=https://stellar-shop-sigma.vercel.app`
- `VITE_ENABLE_GOOGLE_OAUTH=false`
- `VITE_ENABLE_TURNSTILE=false`
- `VITE_USE_SUPABASE_PROXY=true`

Redeploy after changing environment variables.

## Supabase

Authentication -> Providers -> Email: enable Email. Disable Confirm email if signup should immediately log the user in.

Authentication -> URL Configuration:
- Site URL: `https://stellar-shop-sigma.vercel.app`
- Redirect URL: `https://stellar-shop-sigma.vercel.app/**`

Run `supabase/fix_auth_trigger.sql` once in the Supabase SQL Editor so profile rows are created from signup metadata.
