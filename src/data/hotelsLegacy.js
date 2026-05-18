/**
 * Legacy: scan public/assets/hotels at build time when Supabase is not configured.
 */
import { HOTEL_DEFINITIONS } from './hotelDefinitions.js';

const imageGlob = import.meta.glob(
  '/public/assets/hotels/**/*.{jpeg,jpg,png,webp}',
  { eager: false }
);

const allImagePaths = Object.keys(imageGlob)
  .map((p) => p.replace(/^\/public/, ''))
  .sort((a, b) => {
    const numA = parseInt(a.split('/').pop()) || 0;
    const numB = parseInt(b.split('/').pop()) || 0;
    return numA - numB;
  });

function getImagesFromDisk(hotelName, folderName) {
  const prefix = `/assets/hotels/${hotelName}/${folderName}/`;
  return allImagePaths.filter((p) => p.startsWith(prefix));
}

export function buildHotelsFromDisk() {
  const hotels = structuredClone(HOTEL_DEFINITIONS);
  hotels.forEach((hotel) => {
    hotel.categories = hotel.categories
      .map((cat) => {
        const images = getImagesFromDisk(hotel.name, cat.folder);
        return { ...cat, images, count: images.length };
      })
      .filter((cat) => cat.count > 0);
    hotel.heroImage = hotel.categories[0]?.images?.[0] || '';
  });
  return hotels;
}
