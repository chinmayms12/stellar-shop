# Stellar Shop — Authentication deployment checklist

The previous authentication implementation could let a browser `fetch failed` exception escape, leaving the button spinning. This version catches those exceptions, shows an actionable error, and never blocks the storefront when the catalog request fails.

## Vercel environment variables

Set these for **Production, Preview, and Development** as needed:

- `VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SB_PUBLISHABLE_KEY` (or the legacy anon key)
- `VITE_SITE_URL=https://YOUR-VERCEL-DOMAIN.vercel.app`
- `VITE_ENABLE_GOOGLE_OAUTH=false`
- `VITE_ENABLE_TURNSTILE=false` unless Turnstile is deliberately configured

After changing variables, trigger a **new deployment**. Vite embeds `VITE_*` values at build time; changing a Vercel variable does not repair an already-built deployment.

## Supabase

1. Open the project and confirm it is active (not paused).
2. Authentication → Providers → Email → enable Email.
3. Turn **Confirm email OFF** if the requirement is immediate signup/login without verification.
4. Run `supabase/schema.sql` and `supabase/fix_auth_trigger.sql` in SQL Editor.
5. Authentication → URL Configuration: add the exact Vercel URL as an allowed Site URL.
6. Do not put a service-role key in any `VITE_*` variable.

## If the browser still says `fetch failed`

That error means the browser cannot reach the configured Supabase endpoint; it is not a password-validation error. Open the browser DevTools → Network and inspect the failing request. The request should go to:

`https://YOUR_PROJECT.supabase.co/auth/v1/token`

If it does not, the Vercel `VITE_SUPABASE_URL`/key values are wrong or the deployment is stale. If it does, but the request is blocked, check the Supabase project status and browser/network extensions.
