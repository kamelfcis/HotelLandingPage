-- Run in Supabase SQL Editor (or via CLI). Creates tables, RLS, and storage policies.
-- After this: Storage → Create bucket "hotel-images" as PUBLIC if not created via SQL below.

-- Extensions
create extension if not exists "pgcrypto";

-- Hotels (id matches app: king-toot, rocket-beach, nadi-village)
create table if not exists public.hotels (
  id text primary key,
  name text not null unique,
  display_name text not null,
  description text not null
);

-- Room types per hotel (composite key)
create table if not exists public.categories (
  hotel_id text not null references public.hotels (id) on delete cascade,
  category_key text not null,
  name text not null,
  sort_order int not null default 0,
  primary key (hotel_id, category_key)
);

-- Image metadata (URLs from public Storage bucket)
create table if not exists public.category_images (
  id uuid primary key default gen_random_uuid(),
  hotel_id text not null,
  category_key text not null,
  storage_path text not null,
  public_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  constraint category_images_category_fk
    foreign key (hotel_id, category_key)
    references public.categories (hotel_id, category_key)
    on delete cascade,
  constraint category_images_path_unique unique (storage_path)
);

create index if not exists idx_category_images_lookup
  on public.category_images (hotel_id, category_key, sort_order);

-- RLS
alter table public.hotels enable row level security;
alter table public.categories enable row level security;
alter table public.category_images enable row level security;

-- Helper: admin from JWT app_metadata.role = 'admin'
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin';
$$;

-- Public read
create policy "hotels_select_public"
  on public.hotels for select
  using (true);

create policy "categories_select_public"
  on public.categories for select
  using (true);

create policy "category_images_select_public"
  on public.category_images for select
  using (true);

-- Admins: full CRUD on images metadata
create policy "category_images_insert_admin"
  on public.category_images for insert
  to authenticated
  with check (public.is_admin());

create policy "category_images_update_admin"
  on public.category_images for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "category_images_delete_admin"
  on public.category_images for delete
  to authenticated
  using (public.is_admin());

-- Optional: allow admins to manage category rows (for future); keep seed-only for now
create policy "categories_insert_admin"
  on public.categories for insert
  to authenticated
  with check (public.is_admin());

create policy "categories_update_admin"
  on public.categories for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "categories_delete_admin"
  on public.categories for delete
  to authenticated
  using (public.is_admin());

-- Storage bucket (public read). Configure MIME/size limits in Dashboard if needed.
insert into storage.buckets (id, name, public)
values ('hotel-images', 'hotel-images', true)
on conflict (id) do update set public = excluded.public;

-- Storage policies
create policy "hotel_images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'hotel-images');

create policy "hotel_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'hotel-images'
    and public.is_admin()
  );

create policy "hotel_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'hotel-images' and public.is_admin())
  with check (bucket_id = 'hotel-images' and public.is_admin());

create policy "hotel_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'hotel-images' and public.is_admin());
