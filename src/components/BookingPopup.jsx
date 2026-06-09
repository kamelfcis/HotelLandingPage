import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOKING_GROUPS } from '../data/contactGroups';

const WhatsAppIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const PhoneIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MapPinIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ActionButton = ({ href, icon, label, variant }) => {
  const variants = {
    call: 'bg-gold/10 text-gold border-gold/25 hover:bg-gold/20',
    whatsapp: 'bg-[#25D366]/15 text-[#25D366] border-[#25D366]/25 hover:bg-[#25D366]/25',
    location: 'bg-subtle text-ink border-ink/[0.08] hover:bg-ink/[0.06]',
  };

  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className={`flex flex-col items-center justify-center gap-1.5 flex-1 min-w-0 py-3 px-2 rounded-xl border font-arabic text-xs font-bold transition-colors duration-200 ${variants[variant]}`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
};

const BookingGroup = ({ group }) => (
  <div className="bg-subtle rounded-2xl p-5 border border-ink/[0.06]">
    <div className="mb-4">
      <h4 className="text-ink font-arabic font-bold text-base">{group.title}</h4>
      {group.subtitle && (
        <p className="text-muted text-xs font-arabic mt-0.5">{group.subtitle}</p>
      )}
      <p className="text-faint text-xs font-inter mt-2 ltr" dir="ltr">
        {group.phoneDisplay}
      </p>
    </div>

    <div className="flex gap-2">
      <ActionButton
        href={group.tel}
        icon={<PhoneIcon className="w-4 h-4" />}
        label="اتصال"
        variant="call"
      />
      <ActionButton
        href={group.whatsapp}
        icon={<WhatsAppIcon className="w-4 h-4" />}
        label="واتساب"
        variant="whatsapp"
      />
      <ActionButton
        href={group.location}
        icon={<MapPinIcon className="w-4 h-4" />}
        label="الموقع"
        variant="location"
      />
    </div>
  </div>
);

const BookingPopup = ({ isOpen, onClose }) => {
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
                    <PhoneIcon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-white text-xl font-bold font-arabic mb-1">احجز الآن</h3>
                  <p className="text-white/60 text-sm font-arabic">
                    اختر الوجهة المناسبة وتواصل معنا مباشرة
                  </p>
                </div>
              </div>

              <div className="bg-surface border border-ink/[0.06] border-t-0 rounded-b-3xl px-6 sm:px-8 pt-6 pb-8 -mt-4 relative z-10">
                <div className="space-y-4">
                  {BOOKING_GROUPS.map((group) => (
                    <BookingGroup key={group.id} group={group} />
                  ))}
                </div>

                <p className="text-center text-faint text-xs font-arabic mt-5">
                  نحن هنا لمساعدتك في الحجز والاستفسار
                </p>
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

export default BookingPopup;
