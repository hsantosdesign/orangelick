# Orange Lick

Website and admin portal for Orange Lick: authentic Russian snacks, made in the USA.

Next.js 16 (App Router, TypeScript strict), Tailwind CSS 4, Framer Motion, Supabase (`@supabase/ssr`).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your values
npm run dev
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project credentials |
| `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` | Public bucket for uploaded images (default `images`) |
| `NEXT_PUBLIC_USE_MOCK_DATA` | `true` renders the bundled sample snacks/articles (`src/lib/mock-data.ts`). Keep `false` in production. |
| `CONTACT_FORM_WEBHOOK_URL` | Optional. Contact form submissions are POSTed here as JSON (Formspree, Zapier, Make...). Without it, messages are only written to the server log. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used in metadata |

If the database credentials are missing and mock mode is off, public pages show their empty states and the admin portal shows a "not available" notice.

## Database-side checklist

The app uses the existing `products` and `posts` tables as-is (types in `src/types/database.ts`). It expects:

1. **Row Level Security**
   - `anon` can `select` from `products` and `posts`. The app itself filters out unpublished posts; add `published is not false` to the posts policy if drafts must stay private at the database level.
   - `authenticated` can `select`, `insert`, `update` and `delete` on both tables.
2. **Realtime** is enabled for `products` and `posts` (both in the `supabase_realtime` publication). Delete events are matched on `id`, which works with the default replica identity.
3. **Storage**: a **public** bucket named as in `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`, where `authenticated` users can upload and delete objects. Uploads go to `products/` and `posts/`.
4. **Admin users** are created in Authentication > Users (email and password). Any signed-in user is treated as an admin. Public sign-up should be disabled.

## Where things live

```
src/app/                 Routes: /, /products, /products/[slug], /blog, /blog/[slug], /contact, /admin/*
src/app/admin/actions.ts Server Actions: sign in/out, product & post CRUD (validated with Zod)
src/proxy.ts             Auth guard for /admin/* (Next.js 16 "proxy", formerly middleware)
src/lib/supabase/        Browser, server and proxy clients
src/lib/data/            Server-side queries (live data, or mock when the flag is on)
src/lib/site.ts          Brand copy, nav, social links and order URL: edit these first
src/hooks/use-realtime-rows.ts   Live list updates without a page refresh
src/components/          ui/ atoms, layout/, sections/, products/, blog/, admin/, contact/
```

## Content formatting for articles

The article editor accepts plain text with light formatting: blank line = new paragraph, `## Heading`, `### Subheading`, `- bullet`, `1. numbered`, `> quote`, `**bold**`, `*italic*` and `[link text](https://...)`. Raw HTML is never rendered.
