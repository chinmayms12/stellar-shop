-- Run this once in Supabase SQL Editor for existing deployments.
-- It fixes recursive profile RLS and enables the Admin User ID (username) login.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.lookup_admin_email_by_username(p_username text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select email from public.profiles
  where lower(username) = lower(trim(p_username))
    and role = 'admin'
  limit 1;
$$;
revoke all on function public.lookup_admin_email_by_username(text) from public;
grant execute on function public.lookup_admin_email_by_username(text) to anon, authenticated;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());

-- Configure the requested administrator profile.
-- This does NOT create/reset a Supabase Auth password. The Auth account must exist
-- in Supabase Authentication → Users, using the email below.
update public.profiles
set role = 'admin',
    username = 'chinmayms12'
where lower(email) = lower('punichinmayms12@gmail.com');

