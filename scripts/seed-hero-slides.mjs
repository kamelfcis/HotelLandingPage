/**
 * One-time seed: upload the three original static hero-slider images to
 * Supabase Storage (hero/ prefix) and insert rows into hero_slides.
 *
 * Safe to re-run — skips any file whose storage_path already exists.
 *
 * Usage:
 *   node --env-file=.env.migrate scripts/seed-hero-slides.mjs
 */
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'public', 'assets');
const BUCKET = 'hotel-images';

const SLIDES = [
  { file: 'nada.jpg',               storageName: 'hero-nada.jpg',       sortOrder: 0 },
  { file: 'rocketbeach.jpg',        storageName: 'hero-rocketbeach.jpg', sortOrder: 1 },
  { file: 'فندق كينج توت.jpg',      storageName: 'hero-kingtoot.jpg',    sortOrder: 2 },
];

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
});

async function main() {
  for (const slide of SLIDES) {
    const storagePath = `hero/${slide.storageName}`;
    const localPath = path.join(ASSETS, slide.file);

    if (!fs.existsSync(localPath)) {
      console.warn(`File not found, skipping: ${localPath}`);
      continue;
    }

    // Check if already uploaded
    const { data: existing } = await sb
      .from('hero_slides')
      .select('id')
      .eq('storage_path', storagePath)
      .maybeSingle();

    if (existing) {
      console.log(`Already exists, skipping: ${storagePath}`);
      continue;
    }

    // Upload to storage
    const buf = fs.readFileSync(localPath);
    const { error: upErr } = await sb.storage.from(BUCKET).upload(storagePath, buf, {
      contentType: 'image/jpeg',
      upsert: true,
    });
    if (upErr) {
      console.error(`Upload failed for ${slide.file}:`, upErr.message);
      continue;
    }

    const { data: { publicUrl } } = sb.storage.from(BUCKET).getPublicUrl(storagePath);

    const { error: insErr } = await sb.from('hero_slides').insert({
      storage_path: storagePath,
      public_url: publicUrl,
      sort_order: slide.sortOrder,
    });
    if (insErr) {
      console.error(`DB insert failed for ${slide.file}:`, insErr.message);
      continue;
    }

    console.log(`Uploaded & recorded: ${storagePath}`);
  }

  console.log('Done seeding hero slides.');
}

main().catch((e) => { console.error(e); process.exit(1); });
