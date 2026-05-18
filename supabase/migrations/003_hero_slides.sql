-- Hero slider images managed from the admin dashboard.
create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  public_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  constraint hero_slides_path_unique unique (storage_path)
);

create index if not exists idx_hero_slides_order on public.hero_slides (sort_order);

alter table public.hero_slides enable row level security;

create policy "hero_slides_select_public"
  on public.hero_slides for select
  using (true);

create policy "hero_slides_insert_admin"
  on public.hero_slides for insert
  to authenticated
  with check (public.is_admin());

create policy "hero_slides_update_admin"
  on public.hero_slides for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "hero_slides_delete_admin"
  on public.hero_slides for delete
  to authenticated
  using (public.is_admin());
