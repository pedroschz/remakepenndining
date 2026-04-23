-- ============================================================
-- Security lockdown: no client-side writes; signatures without
-- exposing email / ip_hash / user_id via PostgREST.
-- Apply after 0001 (and 0002 if used). Server Actions use
-- SUPABASE_SERVICE_ROLE_KEY and bypass RLS.
-- ============================================================

-- ----------------------------------------------------------------
-- 1) Remove policies that allowed anon to bypass Server Actions
-- ----------------------------------------------------------------
drop policy if exists "anyone insert testimony" on public.testimonies;
drop policy if exists "anyone insert report" on public.testimony_reports;
drop policy if exists "auth insert signature" on public.signatures;

drop policy if exists "public upload testimony images" on storage.objects;

-- ----------------------------------------------------------------
-- 2) Column-level SELECT on signatures (hide email, ip_hash, user_id)
-- ----------------------------------------------------------------
revoke select on table public.signatures from anon;
revoke select on table public.signatures from authenticated;

grant select (
  id,
  created_at,
  display_name,
  affiliation,
  school,
  class_year,
  reason,
  display_publicly,
  verified,
  signature_date,
  attestation_accurate
) on table public.signatures to anon, authenticated;

-- View used for counts; invoker must still satisfy column grants + RLS
grant select on public.signature_count to anon, authenticated;
