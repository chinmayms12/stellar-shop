# Admin login fix

The admin login now accepts either:

- the administrator's Supabase Auth email, or
- the administrator's `profiles.username` (for example `chinmayms12`).

It uses Supabase Auth for the password and never stores an admin password in browser code.

## Required one-time Supabase step

For an existing Supabase project, open **Supabase → SQL Editor**, paste and run:

```sql
-- Paste the complete contents of supabase/fix_admin_login.sql
```

Then make sure the intended Auth account is an administrator:

```sql
update public.profiles
set role = 'admin', username = 'chinmayms12'
where email = 'punichinmayms12@gmail.com';
```

The configured administrator email is `punichinmayms12@gmail.com` and the User ID is `chinmayms12`. The password is managed by Supabase Auth and is intentionally not stored in the frontend source code.

## Vercel

Use these browser-safe variables:

```text
VITE_SUPABASE_URL=https://lykoxkuxwhbwgvyyraqy.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_RaQIld0mkSTzNGFg2FLrEQ_UkQmoeOH
VITE_SITE_URL=https://stellar-shop-sigma.vercel.app
VITE_USE_SUPABASE_PROXY=false
```

Do not put a Supabase service-role key or Razorpay secret in a `VITE_*` variable.

After changing Vercel environment variables or deploying the new source, redeploy. If an old login page is still cached, use a hard refresh or an incognito window.
