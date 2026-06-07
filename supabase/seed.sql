-- Seed hotels and categories (matches src/data/hotelDefinitions.js)
-- Run after 001_schema.sql

insert into public.hotels (id, name, display_name, description) values
  (
    'king-toot',
    'KingToot',
    'كينج توت',
    'فخامة ملكية على ساحل البحر الأحمر، تجمع بين التراث والحداثة.'
  ),
  (
    'rocket-beach',
    'RocketBeach',
    'روكيت بيتش',
    'استمتع بأجواء الطبيعة الساحرة والهدوء التام في قلب الطبيعة.'
  ),
  (
    'nadi-village',
    'قرية الندي',
    'قرية الندي',
    'رفاهية متكاملة للعائلة مع مرافق ترفيهية وخدمات عالمية المستوى.'
  )
on conflict (id) do update set
  name = excluded.name,
  display_name = excluded.display_name,
  description = excluded.description;

insert into public.categories (hotel_id, category_key, name, sort_order) values
  ('king-toot', 'gallery', 'صور الفندق', 0),
  ('king-toot', 'chalet', 'شاليه', 1),
  ('king-toot', 'suite', 'سويت', 2),
  ('king-toot', 'room', 'غرف', 3),
  ('rocket-beach', 'gallery', 'صور الفندق', 0),
  ('rocket-beach', 'apt2', 'شقة 2 غرفه', 1),
  ('rocket-beach', 'apt3', 'شقة 3 غرفه', 2),
  ('rocket-beach', 'villa', 'فيلا', 3),
  ('nadi-village', 'gallery', 'صور القرية', 1),
  ('nadi-village', 'chalet', 'شاليه', 2),
  ('nadi-village', 'apt', 'شقة', 3),
  ('nadi-village', 'villa', 'فيلا', 4)
on conflict (hotel_id, category_key) do update set
  name = excluded.name,
  sort_order = excluded.sort_order;
