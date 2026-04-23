-- Open signatures: no auth required; email optional (null allowed); record sign date + attestation.
--
-- PREREQUISITE: run `0001_init.sql` first in this Supabase project. If you see
-- "relation public.signatures does not exist", 0001 has not been applied (or
-- you are on the wrong project / database).

alter table public.signatures alter column email drop not null;

alter table public.signatures add column if not exists signature_date date;
update public.signatures
   set signature_date = (created_at at time zone 'UTC')::date
 where signature_date is null;
alter table public.signatures alter column signature_date set not null;
alter table public.signatures alter column signature_date set default ((timezone('utc', now()))::date);

alter table public.signatures add column if not exists attestation_accurate boolean not null default true;
