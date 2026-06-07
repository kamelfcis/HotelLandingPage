-- Stores admin-defined category display order per hotel (legacy; ordering now lives on categories.sort_order)
create table if not exists public.hotel_category_orders (
  hotel_id      text        primary key,
  ordered_keys  text[]      not null,
  updated_at    timestamptz not null default now()
);

alter table public.hotel_category_orders enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'hotel_category_orders'
      and policyname = 'cat_order_read_all'
  ) then
    execute $p$
      create policy "cat_order_read_all"
        on public.hotel_category_orders
        for select using (true);
    $p$;
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'hotel_category_orders'
      and policyname = 'cat_order_write_admin'
  ) then
    execute $p$
      create policy "cat_order_write_admin"
        on public.hotel_category_orders
        for all
        to authenticated
        using  (public.is_admin())
        with check (public.is_admin());
    $p$;
  end if;
end $$;
