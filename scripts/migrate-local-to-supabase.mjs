/**
 * One-time migration: upload files from public/assets/hotels/** to Supabase Storage
 * and insert rows into category_images (uses service role — bypasses RLS).
 *
 * Usage (PowerShell):
 *   $env:VITE_SUPABASE_URL="https://xxx.supabase.co"
 *   $env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."
 *   npm run migrate:images
 *
 * Or create .env.migrate (gitignored) with those two variables and:
 *   node --env-file=.env.migrate scripts/migrate-local-to-supabase.mjs
 */
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HOTEL_DEFINITIONS } from '../src/data/hotelDefinitions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const HOTELS_DIR = path.join(ROOT, 'public', 'assets', 'hotels');
const BUCKET = 'hotel-images';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
});

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function uploadWithRetry(storagePath, body, contentType, max = 5) {
  let lastErr;
  for (let attempt = 1; attempt <= max; attempt++) {
    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, body, {
      contentType,
      upsert: true,
    });
    if (!error) return null;
    lastErr = error;
    if (attempt < max) await sleep(1500 * attempt);
  }
  return lastErr;
}

async function upsertRow(row, max = 5) {
  let lastErr;
  for (let attempt = 1; attempt <= max; attempt++) {
    const { error } = await supabase.from('category_images').upsert(row, {
      onConflict: 'storage_path',
    });
    if (!error) return null;
    lastErr = error;
    if (attempt < max) await sleep(1500 * attempt);
  }
  return lastErr;
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (/\.(jpe?g|png|webp)$/i.test(name)) out.push(full);
  }
  return out;
}

function resolveCategory(hotelNameFolder, folderSegment) {
  const def = HOTEL_DEFINITIONS.find((h) => h.name === hotelNameFolder);
  if (!def) return null;
  const cat = def.categories.find((c) => c.folder === folderSegment);
  if (!cat) return null;
  return { hotelId: def.id, categoryKey: cat.id };
}

async function main() {
  const files = walk(HOTELS_DIR);
  console.log(`Found ${files.length} image files under public/assets/hotels`);

  let ok = 0;
  let skip = 0;

  for (const abs of files) {
    const rel = path.relative(HOTELS_DIR, abs).split(path.sep);
    if (rel.length < 3) {
      console.warn('Skip (unexpected depth):', abs);
      skip++;
      continue;
    }
    const hotelFolder = rel[0];
    const categoryFolder = rel[1];
    const fileName = rel[rel.length - 1];

    const resolved = resolveCategory(hotelFolder, categoryFolder);
    if (!resolved) {
      console.warn('Skip (unknown hotel/category folder):', hotelFolder, categoryFolder);
      skip++;
      continue;
    }

    const { hotelId, categoryKey } = resolved;
    const storagePath = `${hotelId}/${categoryKey}/${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const buf = fs.readFileSync(abs);

    const upErr = await uploadWithRetry(
      storagePath,
      buf,
      /\.png$/i.test(fileName)
        ? 'image/png'
        : /\.webp$/i.test(fileName)
          ? 'image/webp'
          : 'image/jpeg'
    );
    if (upErr) {
      console.error('Upload failed', storagePath, upErr.message);
      skip++;
      continue;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

    const num = parseInt(path.parse(fileName).name, 10);
    const sortOrder = Number.isFinite(num) ? num : ok;

    const insErr = await upsertRow({
      hotel_id: hotelId,
      category_key: categoryKey,
      storage_path: storagePath,
      public_url: publicUrl,
      sort_order: sortOrder,
    });

    if (insErr) {
      console.error('DB insert failed', storagePath, insErr.message);
      skip++;
      continue;
    }
    ok++;
    if (ok % 20 === 0) console.log(`… ${ok} uploaded`);
  }

  console.log(`Done. Uploaded+recorded: ${ok}, skipped: ${skip}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
