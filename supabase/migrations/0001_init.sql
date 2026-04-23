-- ============================================================
-- Remake Penn Dining — initial schema
-- ============================================================
-- Run this in the Supabase SQL editor or via the Supabase CLI.
-- ============================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------
-- signatures — people who have signed the petition
-- ----------------------------------------------------------------
create table if not exists public.signatures (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  display_name text not null,
  affiliation text not null check (affiliation in (
    'undergraduate','graduate','faculty','staff','alum','parent','community'
  )),
  school text,
  class_year text,
  reason text,
  display_publicly boolean not null default true,
  verified boolean not null default false,
  ip_hash text,
  unique (email)
);

create index if not exists signatures_created_at_idx
  on public.signatures (created_at desc);

-- ----------------------------------------------------------------
-- testimonies — anonymous or attributed experiences
-- ----------------------------------------------------------------
create table if not exists public.testimonies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  body text not null check (char_length(body) between 30 and 2000),
  dining_hall text check (dining_hall in (
    '1920 Commons','Hill House','Kings Court English','Lauder','Quaker Kitchen',
    'Houston Market','Joe''s Cafe','Pret','Accenture Cafe','Gourmet Grocer',
    'Falk Kosher','Penn Pi','Other'
  )),
  incident_month date,
  affiliation text check (affiliation in (
    'undergraduate','graduate','faculty','staff','alum','parent','community'
  )),
  image_paths text[] not null default '{}',
  report_count integer not null default 0,
  hidden boolean not null default false,
  hidden_reason text,
  ip_hash text
);

create index if not exists testimonies_created_at_idx
  on public.testimonies (created_at desc)
  where hidden = false;

-- ----------------------------------------------------------------
-- reports — flags filed against testimonies
-- ----------------------------------------------------------------
create table if not exists public.testimony_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  testimony_id uuid not null references public.testimonies(id) on delete cascade,
  reason text not null check (reason in (
    'harassment','personal_info','off_topic','spam','misinformation','other'
  )),
  note text,
  ip_hash text,
  unique (testimony_id, ip_hash)
);

-- ----------------------------------------------------------------
-- Auto-hide testimonies once they hit a report threshold
-- ----------------------------------------------------------------
create or replace function public.testimony_auto_hide()
returns trigger
language plpgsql
as $$
begin
  update public.testimonies
     set report_count = report_count + 1,
         hidden = case when report_count + 1 >= 3 then true else hidden end,
         hidden_reason = case when report_count + 1 >= 3
                              then coalesce(hidden_reason, 'auto-hidden: 3+ reports')
                              else hidden_reason end
   where id = new.testimony_id;
  return new;
end;
$$;

drop trigger if exists testimony_report_trg on public.testimony_reports;
create trigger testimony_report_trg
  after insert on public.testimony_reports
  for each row execute function public.testimony_auto_hide();

-- ----------------------------------------------------------------
-- Public signature count view (no PII)
-- ----------------------------------------------------------------
create or replace view public.signature_count as
select count(*)::int as total from public.signatures where verified = true;

-- ----------------------------------------------------------------
-- Row-Level Security
-- ----------------------------------------------------------------
alter table public.signatures enable row level security;
alter table public.testimonies enable row level security;
alter table public.testimony_reports enable row level security;

-- Public can read non-hidden testimonies
drop policy if exists "public read testimonies" on public.testimonies;
create policy "public read testimonies"
  on public.testimonies for select
  using (hidden = false);

-- Public can read publicly displayable signatures (name + affiliation only via view/query)
drop policy if exists "public read public signatures" on public.signatures;
create policy "public read public signatures"
  on public.signatures for select
  using (display_publicly = true and verified = true);

-- Anyone can insert a testimony (server action will validate + rate-limit)
drop policy if exists "anyone insert testimony" on public.testimonies;
create policy "anyone insert testimony"
  on public.testimonies for insert
  with check (true);

-- Anyone can report a testimony
drop policy if exists "anyone insert report" on public.testimony_reports;
create policy "anyone insert report"
  on public.testimony_reports for insert
  with check (true);

-- Authenticated Penn users can insert signatures (server action gates the domain)
drop policy if exists "auth insert signature" on public.signatures;
create policy "auth insert signature"
  on public.signatures for insert
  with check (auth.uid() is not null);

-- ----------------------------------------------------------------
-- Storage bucket for testimony images
-- ----------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'testimony-images',
  'testimony-images',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/heic']
)
on conflict (id) do nothing;

-- Anyone can upload to testimony-images (server action gates submission)
drop policy if exists "public upload testimony images" on storage.objects;
create policy "public upload testimony images"
  on storage.objects for insert to public
  with check (bucket_id = 'testimony-images');

drop policy if exists "public read testimony images" on storage.objects;
create policy "public read testimony images"
  on storage.objects for select to public
  using (bucket_id = 'testimony-images');
