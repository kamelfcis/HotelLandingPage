import { HOTEL_DEFINITIONS } from '../data/hotelDefinitions.js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import { buildHotelsFromDisk } from '../data/hotelsLegacy.js';

const BUCKET = 'hotel-images';

/** @returns {Promise<Array<object>>} */
export async function fetchHotelsWithImages() {
  if (!isSupabaseConfigured || !supabase) {
    return buildHotelsFromDisk();
  }

  const [{ data: imgRows, error: imgErr }, { data: hotelRows, error: hotelErr }] =
    await Promise.all([
      supabase
        .from('category_images')
        .select('hotel_id, category_key, public_url, sort_order')
        .order('sort_order', { ascending: true }),
      supabase
        .from('hotels')
        .select('id, hero_image_url'),
    ]);

  if (imgErr) {
    console.error('[hotelsService] category_images', imgErr);
    return buildHotelsFromDisk();
  }

  const heroMap = new Map((hotelRows || []).map((h) => [h.id, h.hero_image_url]));

  const imgMap = new Map();
  for (const row of imgRows || []) {
    const key = `${row.hotel_id}:${row.category_key}`;
    if (!imgMap.has(key)) imgMap.set(key, []);
    imgMap.get(key).push(row.public_url);
  }

  const hotels = structuredClone(HOTEL_DEFINITIONS);
  hotels.forEach((hotel) => {
    hotel.categories = hotel.categories.map((cat) => {
      const key = `${hotel.id}:${cat.id}`;
      const images = imgMap.get(key) || [];
      return { ...cat, images, count: images.length };
    });
    const savedHero = heroMap.get(hotel.id);
    if (savedHero) {
      hotel.heroImage = savedHero;
    } else {
      const firstWith = hotel.categories.find((c) => c.count > 0);
      hotel.heroImage = firstWith?.images?.[0] || '';
    }
  });

  return hotels;
}

/**
 * Persist a pinned hero/cover image for a hotel.
 * @param {string} hotelId
 * @param {string} imageUrl
 */
export async function setHotelHeroImage(hotelId, imageUrl) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('hotels')
    .update({ hero_image_url: imageUrl })
    .eq('id', hotelId);
  if (error) throw error;
}

/**
 * Fetch the current hero_image_url for a single hotel.
 * @param {string} hotelId
 * @returns {Promise<string|null>}
 */
export async function fetchHotelHeroImage(hotelId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('hotels')
    .select('hero_image_url')
    .eq('id', hotelId)
    .single();
  if (error) return null;
  return data?.hero_image_url ?? null;
}

export async function fetchCategoryImagesForAdmin(hotelId, categoryKey) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('category_images')
    .select('id, storage_path, public_url, sort_order')
    .eq('hotel_id', hotelId)
    .eq('category_key', categoryKey)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getNextSortOrder(hotelId, categoryKey) {
  if (!supabase) return 0;
  const { data, error } = await supabase
    .from('category_images')
    .select('sort_order')
    .eq('hotel_id', hotelId)
    .eq('category_key', categoryKey)
    .order('sort_order', { ascending: false })
    .limit(1);
  if (error) throw error;
  const max = data?.[0]?.sort_order;
  return typeof max === 'number' ? max + 1 : 0;
}

/**
 * @param {File} file
 * @param {string} hotelId
 * @param {string} categoryKey
 */
export async function uploadCategoryImage(file, hotelId, categoryKey, onProgress) {
  if (!supabase) throw new Error('Supabase not configured');
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  const objectName = `${crypto.randomUUID()}.${safeExt}`;
  const storagePath = `${hotelId}/${categoryKey}/${objectName}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      onUploadProgress: onProgress
        ? (p) => onProgress(Math.round((p.loaded / p.total) * 100))
        : undefined,
    });
  if (upErr) throw upErr;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  const sortOrder = await getNextSortOrder(hotelId, categoryKey);
  const { error: insErr } = await supabase.from('category_images').insert({
    hotel_id: hotelId,
    category_key: categoryKey,
    storage_path: storagePath,
    public_url: publicUrl,
    sort_order: sortOrder,
  });
  if (insErr) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw insErr;
  }
}

/**
 * @param {{ id: string, storage_path: string }} row
 */
export async function deleteCategoryImage(row) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error: dbErr } = await supabase.from('category_images').delete().eq('id', row.id);
  if (dbErr) throw dbErr;
  const { error: stErr } = await supabase.storage.from(BUCKET).remove([row.storage_path]);
  if (stErr) console.warn('[deleteCategoryImage] storage remove', stErr);
}

export { BUCKET as HOTEL_IMAGES_BUCKET };

/* ── hero slides ─────────────────────────────────────────────────── */

/** @returns {Promise<string[]>} ordered list of public URLs */
export async function fetchHeroSlides() {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('hero_slides')
    .select('public_url')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('[hotelsService] hero_slides', error);
    return [];
  }
  return (data || []).map((r) => r.public_url);
}

/** @returns {Promise<Array<{id:string,storage_path:string,public_url:string,sort_order:number}>>} */
export async function fetchHeroSlidesForAdmin() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('hero_slides')
    .select('id, storage_path, public_url, sort_order')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export const HERO_SLIDES_MAX = 3;

/**
 * Upload a new hero slide image (max HERO_SLIDES_MAX total).
 * @param {File} file
 * @param {function} [onProgress]
 */
export async function uploadHeroSlide(file, onProgress) {
  if (!supabase) throw new Error('Supabase not configured');

  // Enforce cap before uploading
  const { count, error: cntErr } = await supabase
    .from('hero_slides')
    .select('id', { count: 'exact', head: true });
  if (cntErr) throw cntErr;
  if (count >= HERO_SLIDES_MAX) {
    throw new Error(`يمكنك إضافة ${HERO_SLIDES_MAX} صور فقط في الشريط الرئيسي. احذف إحداها أولاً.`);
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  const storagePath = `hero/${crypto.randomUUID()}.${safeExt}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      onUploadProgress: onProgress
        ? (p) => onProgress(Math.round((p.loaded / p.total) * 100))
        : undefined,
    });
  if (upErr) throw upErr;

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  const { data: maxRow } = await supabase
    .from('hero_slides')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);
  const nextOrder = typeof maxRow?.[0]?.sort_order === 'number' ? maxRow[0].sort_order + 1 : 0;

  const { error: insErr } = await supabase.from('hero_slides').insert({
    storage_path: storagePath,
    public_url: publicUrl,
    sort_order: nextOrder,
  });
  if (insErr) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw insErr;
  }
}

/** @param {{ id: string, storage_path: string }} row */
export async function deleteHeroSlide(row) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error: dbErr } = await supabase.from('hero_slides').delete().eq('id', row.id);
  if (dbErr) throw dbErr;
  const { error: stErr } = await supabase.storage.from(BUCKET).remove([row.storage_path]);
  if (stErr) console.warn('[deleteHeroSlide] storage remove', stErr);
}
