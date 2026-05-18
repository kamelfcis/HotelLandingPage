import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HotelShowcase from '../components/HotelShowcase';
import { fetchHotelsWithImages } from '../services/hotelsService';

export default function HotelDetailPage() {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const hotels = await fetchHotelsWithImages();
        if (cancelled) return;
        const found = hotels.find((h) => h.id === hotelId);
        if (!found) {
          setError('لم يتم العثور على الفندق');
        } else {
          setHotel(found);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'فشل تحميل البيانات');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [hotelId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-page flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="text-gold font-arabic text-lg"
        >
          جارٍ التحميل…
        </motion.div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="fixed inset-0 bg-page flex flex-col items-center justify-center gap-6 font-arabic text-center px-4">
        <p className="text-red-400 text-base">{error || 'فندق غير موجود'}</p>
        <button
          onClick={() => navigate('/')}
          className="text-gold underline underline-offset-4 text-sm"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <HotelShowcase
        key={hotel.id}
        selectedHotel={hotel}
        onBack={() => navigate('/')}
      />
    </AnimatePresence>
  );
}
