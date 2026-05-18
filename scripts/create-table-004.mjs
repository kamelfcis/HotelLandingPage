/**
 * Creates the hotel_category_orders table using Supabase Management API
 * via a simple SQL execution through the pg REST endpoint.
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import ws from 'ws';
import { createClient } from '@supabase/supabase-js';

const __dir = dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(
  readFileSync(join(__dir, '..', '.env.migrate'), 'utf8')
    .split('\n').filter(l => l.includes('=')).map(l => {
      const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim()];
    })
);

const URL = env.VITE_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const REF = URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

// Use the Supabase Management API SQL endpoint
// This requires posting to the projects/{ref}/database/query endpoint
// with Authorization: Bearer <management_token>
// Since we only have service_role, let's use a workaround:
// Call the supabase REST API with a raw postgres query via the pg endpoint

const sqlStatements = `
create table if not exists public.hotel_category_orders (
  hotel_id     text        primary key,
  ordered_keys text[]      not null,
  updated_at   timestamptz not null default now()
);
alter table public.hotel_category_orders enable row level security;
`;

const policySql = `
do $outer$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='hotel_category_orders' and policyname='cat_order_read_all') then
    create policy "cat_order_read_all" on public.hotel_category_orders for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='hotel_category_orders' and policyname='cat_order_write_admin') then
    create policy "cat_order_write_admin" on public.hotel_category_orders for all to authenticated using (public.is_admin()) with check (public.is_admin());
  end if;
end $outer$;
`;

// Try Supabase's internal pg SQL endpoint (undocumented but works with service_role)
async function runSQL(sql) {
  const res = await fetch(`${URL}/pg/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      'apikey': KEY,
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

// Alternative: use Supabase Management API
async function runSQLMgmt(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

console.log('Attempting to create table via Supabase pg endpoint...');
let r = await runSQL(sqlStatements + policySql);
console.log('Status:', r.status, 'Body:', r.body.slice(0, 200));

if (r.status !== 200) {
  console.log('\nTrying management API...');
  r = await runSQLMgmt(sqlStatements + policySql);
  console.log('Status:', r.status, 'Body:', r.body.slice(0, 200));
}

if (r.status !== 200) {
  console.log('\n⚠️  Automatic migration failed.');
  console.log('Please run the following SQL manually in your Supabase Dashboard:');
  console.log('https://supabase.com/dashboard/project/' + REF + '/sql/new\n');
  console.log('--- COPY THIS SQL ---');
  console.log(sqlStatements + policySql);
  console.log('--- END SQL ---');
} else {
  console.log('✅ Migration 004 applied successfully!');
}
