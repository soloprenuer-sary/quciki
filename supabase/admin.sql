-- Admin and CMS schema. Run AFTER supabase/schema.sql, in the Supabase SQL editor.
--
-- Security model
--   * Anyone (anon key) can READ published content, SEO overrides, calculator copy, redirects and public settings.
--   * Only users listed in public.admin_users can WRITE, enforced by Row Level Security (not just by the app).
--   * Do not put secrets in site_settings: it is publicly readable.
--
-- After running this file:
--   1. Supabase Dashboard > Authentication > Providers > Email: turn OFF "Allow new users to sign up".
--   2. Authentication > Users > Add user (your email + a strong password).
--   3. Run:  insert into public.admin_users (email) values ('you@example.com');

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- admins
create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

drop policy if exists "admins can see themselves" on public.admin_users;
create policy "admins can see themselves" on public.admin_users
  for select to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- ---------------------------------------------------------------- guides
create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null,
  title text not null,
  description text not null default '',
  body_md text not null default '',
  cover_url text,
  calculator_slug text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guides_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint guides_title_len check (char_length(title) between 3 and 200)
);
create index if not exists guides_status_idx on public.guides (status, published_at desc);
alter table public.guides enable row level security;

drop policy if exists "public reads published guides" on public.guides;
create policy "public reads published guides" on public.guides
  for select to anon, authenticated
  using (status = 'published' and (published_at is null or published_at <= now()));

drop policy if exists "admins manage guides" on public.guides;
create policy "admins manage guides" on public.guides
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- seo overrides (one row per URL path)
create table if not exists public.seo_overrides (
  path text primary key,
  title text,
  description text,
  canonical text,
  og_image text,
  noindex boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint seo_path_format check (path like '/%')
);
alter table public.seo_overrides enable row level security;

drop policy if exists "public reads seo overrides" on public.seo_overrides;
create policy "public reads seo overrides" on public.seo_overrides
  for select to anon, authenticated using (true);

drop policy if exists "admins manage seo overrides" on public.seo_overrides;
create policy "admins manage seo overrides" on public.seo_overrides
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- calculator copy overrides (text only; formulas stay in code)
create table if not exists public.calculator_content (
  slug text primary key,
  tagline text,
  intro jsonb,
  steps jsonb,
  formula jsonb,
  example jsonb,
  tips jsonb,
  faqs jsonb,
  updated_at timestamptz not null default now()
);
alter table public.calculator_content enable row level security;

drop policy if exists "public reads calculator content" on public.calculator_content;
create policy "public reads calculator content" on public.calculator_content
  for select to anon, authenticated using (true);

drop policy if exists "admins manage calculator content" on public.calculator_content;
create policy "admins manage calculator content" on public.calculator_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- redirects
create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  source text not null unique,
  destination text not null,
  permanent boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint redirects_source_format check (source like '/%'),
  constraint redirects_not_self check (source <> destination)
);
alter table public.redirects enable row level security;

drop policy if exists "public reads redirects" on public.redirects;
create policy "public reads redirects" on public.redirects
  for select to anon, authenticated using (true);

drop policy if exists "admins manage redirects" on public.redirects;
create policy "admins manage redirects" on public.redirects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- site settings (public values only!)
create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

drop policy if exists "public reads site settings" on public.site_settings;
create policy "public reads site settings" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "admins manage site settings" on public.site_settings;
create policy "admins manage site settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- let admins read the form submissions too
drop policy if exists "admins read subscribers" on public.subscribers;
create policy "admins read subscribers" on public.subscribers for select to authenticated using (public.is_admin());
drop policy if exists "admins read contact messages" on public.contact_messages;
create policy "admins read contact messages" on public.contact_messages for select to authenticated using (public.is_admin());
drop policy if exists "admins read saved estimates" on public.saved_estimates;
create policy "admins read saved estimates" on public.saved_estimates for select to authenticated using (public.is_admin());

-- ---------------------------------------------------------------- media storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

drop policy if exists "public reads media" on storage.objects;
create policy "public reads media" on storage.objects for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists "admins write media" on storage.objects;
create policy "admins write media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins update media" on storage.objects;
create policy "admins update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
