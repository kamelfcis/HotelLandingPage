-- Add hero_image_url to hotels so admins can pin one image as the landing-page card cover.
alter table public.hotels
  add column if not exists hero_image_url text;

-- Allow authenticated admins to update hotel rows (e.g. hero_image_url).
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'hotels'
      and policyname = 'hotels_update_admin'
  ) then
    execute $p$
      create policy "hotels_update_admin"
        on public.hotels for update
        to authenticated
        using (public.is_admin())
        with check (public.is_admin());
    $p$;
  end if;
end $$;
