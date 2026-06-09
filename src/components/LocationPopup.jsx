import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOKING_GROUPS } from '../data/contactGroups';

const MapPinIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const LocationCard = ({ group }) => (
  <div className="bg-subtle rounded-2xl p-5 border border-ink/[0.06]">
    <div className="mb-4">
      <h4 className="text-ink font-arabic font-bold text-base">{group.title}</h4>
      {group.subtitle && (
        <p className="text-muted text-xs font-arabic mt-0.5">{group.subtitle}</p>
      )}
    </div>

    <a
      href={group.location}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gold/10 text-gold border border-gold/25 hover:bg-gold/20 font-arabic text-sm font-bold transition-colors duration-200"
    >
      <MapPinIcon className="w-5 h-5" />
      <span>فتح في خرائط Google</span>
    </a>
  </div>
);

const LocationPopup = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[150] bg-black/50 dark:bg-navy-dark/80"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg rounded-3xl overflow-hidden pointer-events-auto shadow-2xl shadow-gold/10"
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
            >
              <div className="bg-gradient-to-br from-navy via-navy-light to-navy-dark px-8 pt-8 pb-14 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full border border-gold/30" />
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full border border-gold/20" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/25 flex items-center justify-center mx-auto mb-4">
                    <MapPinIcon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-white text-xl font-bold font-arabic mb-1">اختر الموقع</h3>
                  <p className="text-white/60 text-sm font-arabic">
                    افتح الخريطة للوجهة التي تريدها
                  </p>
                </div>
              </div>

              <div className="bg-surface border border-ink/[0.06] border-t-0 rounded-b-3xl px-6 sm:px-8 pt-6 pb-8 -mt-4 relative z-10">
                <div className="space-y-4">
                  {BOOKING_GROUPS.map((group) => (
                    <LocationCard key={group.id} group={group} />
                  ))}
                </div>
              </div>

              <button
                onClick={onClose}
                className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors duration-200 text-sm"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LocationPopup;
