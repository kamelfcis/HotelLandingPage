/**
 * Static hotel + room-type metadata (no images).
 * Images come from Supabase when configured, else from legacy disk scan.
 */
export const HOTEL_DEFINITIONS = [
  {
    id: 'king-toot',
    name: 'KingToot',
    displayName: 'كينج توت',
    description:
      'فخامة ملكية على ساحل البحر الأحمر، تجمع بين التراث والحداثة.',
    categories: [
      { id: 'gallery', name: 'معرض الصور', folder: 'gallery' },
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
      { id: 'gallery', name: 'معرض الصور', folder: 'gallery' },
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
