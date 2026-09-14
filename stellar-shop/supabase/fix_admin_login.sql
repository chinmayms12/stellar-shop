-- Stellar Shop: final admin-login repair
-- Run this ONCE in Supabase SQL Editor after the administrator Auth user exists.
-- The web app no longer depends on lookup_admin_email_by_username(), so a missing
-- RPC cannot break the login form.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Make the existing Auth account an administrator.
-- This updates the profile created by handle_new_user().
update public.profiles
set role = 'admin',
    username = 'chinmayms12',
    email = lower('punichinmayms12@gmail.com')
where lower(email) = lower('punichinmayms12@gmail.com');

-- If the Auth user already exists but the profile trigger was not present,
-- create the profile from auth.users as well.
insert into public.profiles (id, name, email, username, role)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'name', split_part(coalesce(u.email, ''), '@', 1)),
  lower(u.email),
  'chinmayms12',
  'admin'
from auth.users u
where lower(u.email) = lower('punichinmayms12@gmail.com')
  and not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do update set
  email = excluded.email,
  username = excluded.username,
  role = 'admin';

-- Keep the username unique and ensure future Auth signups still create profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, mobile, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email, ''), '@', 1)),
    new.email,
    new.raw_user_meta_data->>'mobile',
    new.raw_user_meta_data->>'username'
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    mobile = excluded.mobile,
    username = excluded.username;
  return new;
end;
$$;
