# Remake Penn Dining

A student-organized petition site built on the public record. Evidence, signatures, testimonies, and peer comparisons arguing that Penn should end its Bon Appétit contract and self-operate dining.

## Stack

- **Next.js 15** (App Router, React Server Components, Server Actions)
- **Supabase** (Postgres, Auth, Storage, Realtime)
- **Tailwind CSS v4** (inline `@theme` tokens)
- **Framer Motion** (subtle, reduced-motion-aware animations)
- **Deployed on Vercel** (Node runtime Fluid Compute)

## Getting started

### 1. Install dependencies

```bash
pnpm install
# or npm install
```

### 2. Create a Supabase project

1. Create a project at https://supabase.com/dashboard
2. Open **SQL Editor → New query** and paste the contents of
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). Run.
3. **Authentication → Providers**
   - Enable **Email** (magic link) — no further config needed
   - Enable **Google**, set the OAuth credentials from Google Cloud Console,
     and add `http://localhost:3000/auth/callback` plus your production URL
     to the redirect allowlist.
4. **Authentication → URL Configuration** → set Site URL to your site
   (`http://localhost:3000` in dev).

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...      # Server-only. Used for image uploads.
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SIGNATURE_GOAL=5000
```

### 4. Run locally

```bash
pnpm dev
# → http://localhost:3000
```

### 5. Deploy to Vercel

```bash
vercel
```

Set the same env vars in the Vercel project dashboard (or `vercel env`). The
Supabase OAuth redirect URL needs to include your production domain.

## Structure

```
src/
├── app/
│   ├── page.tsx              # Landing (hero, stats, timeline preview, peer table, CTAs)
│   ├── petition/             # Full petition text
│   ├── evidence/             # Complete incident timeline
│   ├── compare/              # Peer-institution table
│   ├── sign/                 # Sign-in + signature form + /thanks
│   ├── signatures/           # Public wall of signers
│   ├── testimonies/          # Wall + /new submission
│   ├── share/                # Share kit
│   ├── auth/callback/        # Supabase auth callback route
│   ├── api/og/               # Generated social preview card
│   └── actions/              # Server actions (sign, testimony, report, auth)
├── components/               # UI components (all restyled in editorial voice)
├── lib/
│   ├── data.ts               # Static data: timeline events, stats, peer list
│   ├── utils.ts              # cn, formatters, IP hash, Penn-email regex
│   └── supabase/             # Browser / server / middleware / service clients
├── middleware.ts             # Refreshes Supabase sessions on every request
└── app/globals.css           # Editorial design tokens
```

## Design system

- **Palette** — cream `#F7F4EE`, ink `#1A1A1A`, accent `#8B1818`. Penn red is
  deliberately *not* used; the muted red is the campaign's own.
- **Type** — Fraunces (display serif, optical size axis) + Inter (body).
  Tabular figures on all statistics.
- **Motion** — Scroll-fade, sticky nav blur, thermometer fill, one hero entrance.
  No parallax. Everything respects `prefers-reduced-motion`.

## Moderation model

Testimonies publish immediately (auto-publish with report button). Three
distinct reports (deduped by hashed IP) auto-hide a post via a Postgres
trigger. The `testimony_auto_hide()` function lives in
[`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).

A simple banned-phrase regex filter runs before insert to catch slurs and
violent language. Expand as needed.

## Auth gate

Only `@upenn.edu` addresses can sign the petition:

- **Google** — passes `hd=upenn.edu` to the OAuth call so the domain picker
  is scoped server-side.
- **Magic link** — email is validated against the regex in
  [`src/lib/utils.ts`](src/lib/utils.ts) before sending.
- **Callback** — `src/app/auth/callback/route.ts` signs the user out and
  redirects with an error if the email isn't Penn.

## License

Content and code: MIT (see `LICENSE`). Reuse the scaffolding for your own
campaign.
