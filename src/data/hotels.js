/**
 * Auto-scan all hotel images from public/assets/hotels/ at build time.
 * Vite's import.meta.glob resolves matching file paths during compilation,
 * so we never need to hardcode image counts — just add/remove files from
 * the folders and the app picks them up automatically.
 */
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

function getImages(hotelName, folderName) {
  const prefix = `/assets/hotels/${hotelName}/${folderName}/`;
  return allImagePaths.filter((p) => p.startsWith(prefix));
}

export const hotels = [
  {
    id: 'king-toot',
    name: 'KingToot',
    displayName: 'كينج توت',
    description:
      'فخامة ملكية على ساحل البحر الأحمر، تجمع بين التراث والحداثة.',
    categories: [
      { id: 'chalet', name: 'شاليه', folder: 'الشاليه' },
      { id: 'suite', name: 'سويت', folder: 'سويت' },
      { id: 'room', name: 'غرف', folder: 'الغرف' },
    ],
  },
  {
    id: 'rocket-beach',
    name: 'RocketBeach',
    displayName: 'روكيت بيتش',
    description:
      'استمتع بأجواء الطبيعة الساحرة والهدوء التام في قلب الطبيعة.',
    categories: [
      { id: 'apt2', name: 'شقة 2 غرفه', folder: 'RocketBeach شقة 2 غرفه' },
      { id: 'apt3', name: 'شقة 3 غرفه', folder: 'RocketBeach شقة 3 غرفه' },
      { id: 'villa', name: 'فيلا', folder: 'RocketBeach فيلا' },
    ],
  },
  {
    id: 'nadi-village',
    name: 'قرية الندي',
    displayName: 'قرية الندي',
    description:
      'رفاهية متكاملة للعائلة مع مرافق ترفيهية وخدمات عالمية المستوى.',
    categories: [
      { id: 'gallery', name: 'صور القرية', folder: 'صور القرية' },
      { id: 'chalet', name: 'شاليه', folder: 'قرية الندي شاليه' },
      { id: 'apt', name: 'شقة', folder: 'قريه الندي شقه' },
      { id: 'villa', name: 'فيلا', folder: 'قريه الندي فيلا' },
    ],
  },
];

hotels.forEach((hotel) => {
  hotel.categories = hotel.categories
    .map((cat) => {
      const images = getImages(hotel.name, cat.folder);
      return { ...cat, images, count: images.length };
    })
    .filter((cat) => cat.count > 0);

  hotel.heroImage = hotel.categories[0]?.images?.[0] || '';
});
