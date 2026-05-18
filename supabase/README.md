# Supabase setup (hotels admin + dynamic images)

## 1. Create a Supabase project

In the [Supabase Dashboard](https://supabase.com/dashboard), create a project and note:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon public key** → `VITE_SUPABASE_ANON_KEY`

## 2. Run SQL

1. Open **SQL Editor** in Supabase.
2. Paste and run `migrations/001_schema.sql`.
3. Paste and run `seed.sql`.

## 3. Create first admin user

1. **Authentication → Users → Add user** (email + password).
2. Open the user row → **Edit user** → **App metadata** (raw JSON) and set:

```json
{ "role": "admin" }
```

Only users with `app_metadata.role === "admin"` can upload/delete images (RLS + Storage policies).

## 4. Storage bucket

The migration inserts the `hotel-images` bucket as **public** so `getPublicUrl` works for the landing page. If the bucket already existed, verify **Storage → hotel-images → Public bucket** is enabled.

## 5. Frontend env (local)

Copy `.env.example` to `.env` and fill values:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

## 6. Vercel

Add the same two variables in **Project → Settings → Environment Variables**, then redeploy.

## 7. Migrate existing local images (optional)

See [scripts/README-migrate.md](../scripts/README-migrate.md). Run `npm run migrate:images` locally with `SUPABASE_SERVICE_ROLE_KEY` (never add the service role key to Vercel or the client).
