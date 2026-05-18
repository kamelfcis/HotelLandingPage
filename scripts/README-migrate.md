# Migrate local `public/assets/hotels` images to Supabase

This uses the **service role key** (full access). Never commit it or expose it in the browser.

## Prerequisites

- **Node 20+**: the Supabase JS client in Node needs the `ws` package and `realtime: { transport: ws }` (already wired in this repo’s scripts).
1. Run `supabase/migrations/001_schema.sql` and `supabase/seed.sql` in the Supabase SQL editor (or `npm run seed:db` with the service role).
2. Ensure the `hotel-images` bucket exists and is public (migration inserts it).

## Run (PowerShell)

```powershell
cd "D:\Graduation Project 2025\HotelLandingPage"
$env:VITE_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="your_service_role_secret"
npm run migrate:images
```

Or with Node 20+:

```bash
node --env-file=.env.migrate scripts/migrate-local-to-supabase.mjs
```

Put `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.migrate` (gitignored).

## What it does

- Walks `public/assets/hotels/{HotelFolder}/{CategoryFolder}/*`
- Matches folders to [src/data/hotelDefinitions.js](src/data/hotelDefinitions.js) (`name` + `folder`)
- Uploads to Storage path `{hotelId}/{categoryKey}/{sanitizedFileName}`
- Inserts/updates `category_images` with `public_url` and `sort_order` from numeric filename when possible
