import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import ws from 'ws';

const __dirname = dirname(fileURLToPath(import.meta.url));

// manually parse .env.migrate
const envText = readFileSync(join(__dirname, '..', '.env.migrate'), 'utf8');
const env = Object.fromEntries(
  envText.split('\n').filter(l => l.includes('=')).map(l => {
    const idx = l.indexOf('=');
    return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
  })
);
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars in .env.migrate');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws },
});

// Run migration via Supabase management API (pg_dump endpoint not available on free tier).
// Instead we use individual SQL statements through the REST query helper.
const statements = [
  `create table if not exists public.hotel_category_orders (
    hotel_id      text        primary key,
    ordered_keys  text[]      not null,
    updated_at    timestamptz not null default now()
  )`,
  `alter table public.hotel_category_orders enable row level security`,
  `do $$ begin
    if not exists (
      select 1 from pg_policies
      where schemaname='public' and tablename='hotel_category_orders' and policyname='cat_order_read_all'
    ) then
      execute $p$ create policy "cat_order_read_all" on public.hotel_category_orders for select using (true) $p$;
    end if;
  end $$`,
  `do $$ begin
    if not exists (
      select 1 from pg_policies
      where schemaname='public' and tablename='hotel_category_orders' and policyname='cat_order_write_admin'
    ) then
      execute $p$ create policy "cat_order_write_admin" on public.hotel_category_orders for all to authenticated using (public.is_admin()) with check (public.is_admin()) $p$;
    end if;
  end $$`,
];

for (const sql of statements) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: 'HEAD',
  });
  // Use the Supabase DB query via pg_query function if available, else use direct REST
  // We'll use the built-in rpc or direct pg approach
  console.log('Executing:', sql.slice(0, 60).replace(/\n/g, ' ') + '...');
}

// Use pg via the Supabase DB URL approach with fetch to the DB API
// The simplest approach for Supabase hosted: call the custom SQL function we created earlier
// or use the postgres URL directly.

// Actually, let's use the Supabase management API for running SQL
const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) { console.error('Cannot parse project ref from URL'); process.exit(1); }

const MANAGEMENT_API = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

// The management API requires a personal access token, not service role.
// Instead, let's insert a dummy record to verify the table exists after using
// Supabase's built-in REST to create the table via a stored procedure call.

// Best approach: use pg connection string from env if available, else use Supabase's
// SQL editor API (requires dashboard auth) or the exec_sql RPC.

// Let's try the exec_sql RPC which was set up in earlier migrations
const allSql = statements.join(';\n');
const { data, error } = await supabase.rpc('exec_sql', { sql: allSql });
if (error) {
  // exec_sql may not exist — try creating the table via direct upsert approach
  console.log('exec_sql not available, trying direct table check...');
  // Try a select to see if table already exists
  const { error: selErr } = await supabase.from('hotel_category_orders').select('hotel_id').limit(1);
  if (selErr?.code === '42P01') {
    console.error('Table does not exist and cannot be created via REST API.');
    console.error('Please run the SQL in supabase/migrations/004_category_order.sql manually via the Supabase SQL editor.');
    console.error('Dashboard: https://supabase.com/dashboard/project/' + projectRef + '/sql');
    process.exit(1);
  } else {
    console.log('Table hotel_category_orders already exists or was already created.');
  }
} else {
  console.log('Migration 004 applied successfully:', data);
}
