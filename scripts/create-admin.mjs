/**
 * Create admin user (Auth) with app_metadata.role = admin.
 * Run: VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/create-admin.mjs
 */
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL || 'artillerya40@gmail.com';
const password = process.env.ADMIN_PASSWORD || 'HotelAdmin2026!ChangeMe';

if (!url || !key) {
  console.error('Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
});

async function main() {
  const { error } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: 'admin' },
  });

  if (error) {
    if (error.message?.includes('already been registered')) {
      const { data: list } = await sb.auth.admin.listUsers({ perPage: 200 });
      const u = list?.users?.find((x) => x.email === email);
      if (u) {
        const { error: uErr } = await sb.auth.admin.updateUserById(u.id, {
          app_metadata: { role: 'admin' },
        });
        if (uErr) throw uErr;
        console.log('Updated existing user to admin:', email);
        return;
      }
    }
    throw error;
  }

  console.log('Created admin user:', email);
  console.log('Temporary password (change after login):', password);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
