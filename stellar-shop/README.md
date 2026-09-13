# Stellar Shop

Production-ready Vite + React + TypeScript storefront backed by Supabase.

## Authentication

The application uses Supabase Auth directly. There is no hard-coded administrator backdoor, mock authentication server, local product catalog, or sample product dataset.

Production environment variables:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
VITE_SITE_URL=https://YOUR_APP.vercel.app
VITE_ENABLE_GOOGLE_OAUTH=false
```

For this deployment, `.env.production` is already configured for the Supabase project supplied for Stellar Shop. Do not replace it with a different project unless you also run the schema there.

## Supabase setup

1. Open the Supabase project.
2. Run `supabase/schema.sql` in the SQL Editor.
3. In Authentication → Providers → Email, enable Email.
4. Turn **Confirm email OFF** if signup should immediately create a session.
5. In Authentication → URL Configuration, set the Site URL to the Vercel production URL and add the production URL to Redirect URLs.
6. Register the administrator through normal Supabase Auth, then set that user's `profiles.role` to `admin` in the SQL Editor.

## Catalog

Products are loaded from `public.products`. The admin dashboard can create, edit, delete, import and export products. Categories and brands are derived from the actual products in Supabase; there is no bundled fake catalog.

An empty product table is valid. The storefront will show an empty-catalog state until the administrator publishes real products.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Deploy the project root to Vercel. Vercel environment variables must be configured before the deployment build.

## Payments

Razorpay serverless functions are included in `api/razorpay/`. Add the required Razorpay environment variables in Vercel only when live payments are enabled.
