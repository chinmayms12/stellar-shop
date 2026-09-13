# Admin authentication

The admin dashboard uses Supabase Auth. There is no browser-side admin username/password fallback.

1. Register the administrator through Supabase Auth.
2. Promote that account with:

```sql
update public.profiles set role = 'admin' where email = 'YOUR_ADMIN_EMAIL';
```

3. Sign in at `/admin-login` using the same Supabase email/password.

Authorization is enforced by Supabase Row Level Security and `profiles.role`; a value stored in sessionStorage is only a UI hint and cannot grant access.
