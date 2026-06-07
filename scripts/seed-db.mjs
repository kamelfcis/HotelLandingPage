/**
 * Upsert hotels + categories into Supabase (uses service role; bypasses RLS).
 * Run: SUPABASE_SERVICE_ROLE_KEY=... VITE_SUPABASE_URL=... node scripts/seed-db.mjs
 */
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false },
  realtime: { transport: ws },
});

const HOTELS = [
  {
    id: 'king-toot',
    name: 'KingToot',
    display_name: 'كينج توت',
    description:
      'فخامة ملكية على ساحل البحر الأحمر، تجمع بين التراث والحداثة.',
  },
  {
    id: 'rocket-beach',
    name: 'RocketBeach',
    display_name: 'روكيت بيتش',
    description:
      'استمتع بأجواء الطبيعة الساحرة والهدوء التام في قلب الطبيعة.',
  },
  {
    id: 'nadi-village',
    name: 'قرية الندي',
    display_name: 'قرية الندي',
    description:
      'رفاهية متكاملة للعائلة مع مرافق ترفيهية وخدمات عالمية المستوى.',
  },
];

const CATEGORIES = [
  ['king-toot', 'gallery', 'صور الفندق', 0],
  ['king-toot', 'chalet', 'شاليه', 1],
  ['king-toot', 'suite', 'سويت', 2],
  ['king-toot', 'room', 'غرف', 3],
  ['rocket-beach', 'gallery', 'صور الفندق', 0],
  ['rocket-beach', 'apt2', 'شقة 2 غرفه', 1],
  ['rocket-beach', 'apt3', 'شقة 3 غرفه', 2],
  ['rocket-beach', 'villa', 'فيلا', 3],
  ['nadi-village', 'gallery', 'صور القرية', 1],
  ['nadi-village', 'chalet', 'شاليه', 2],
  ['nadi-village', 'apt', 'شقة', 3],
  ['nadi-village', 'villa', 'فيلا', 4],
];

async function main() {
  const { error: hErr } = await sb.from('hotels').upsert(HOTELS, { onConflict: 'id' });
  if (hErr) throw hErr;
  console.log('Hotels upserted:', HOTELS.length);

  const rows = CATEGORIES.map(([hotel_id, category_key, name, sort_order]) => ({
    hotel_id,
    category_key,
    name,
    sort_order,
  }));
  const { error: cErr } = await sb.from('categories').upsert(rows, {
    onConflict: 'hotel_id,category_key',
  });
  if (cErr) throw cErr;
  console.log('Categories upserted:', rows.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
