-- Run this in the Supabase SQL editor (Project > SQL Editor > New query).
-- The website only INSERTs through its own API routes. Row Level Security
-- blocks reads for the public anon key, so visitors' emails stay private.

create extension if not exists "pgcrypto";

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  created_at timestamptz not null default now(),
  constraint subscribers_email_len check (char_length(email) between 5 and 254)
);
create unique index if not exists subscribers_email_key on public.subscribers (lower(email));

create table if not exists public.saved_estimates (
  id uuid primary key default gen_random_uuid(),
  calculator text not null,
  email text,
  inputs jsonb not null,
  summary text,
  created_at timestamptz not null default now(),
  constraint saved_estimates_calc_len check (char_length(calculator) between 2 and 80)
);
create index if not exists saved_estimates_calc_idx on public.saved_estimates (calculator, created_at desc);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  constraint contact_msg_len check (char_length(message) between 5 and 4000)
);

alter table public.subscribers enable row level security;
alter table public.saved_estimates enable row level security;
alter table public.contact_messages enable row level security;

-- Insert-only for the anon role. No select/update/delete policies = no public reads.
drop policy if exists "anon can insert subscribers" on public.subscribers;
create policy "anon can insert subscribers" on public.subscribers for insert to anon with check (true);

drop policy if exists "anon can insert saved_estimates" on public.saved_estimates;
create policy "anon can insert saved_estimates" on public.saved_estimates for insert to anon with check (true);

drop policy if exists "anon can insert contact_messages" on public.contact_messages;
create policy "anon can insert contact_messages" on public.contact_messages for insert to anon with check (true);
