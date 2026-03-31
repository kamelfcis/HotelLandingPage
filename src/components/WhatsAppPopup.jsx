import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsAppIcon = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const WhatsAppPopup = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[150] bg-black/50 dark:bg-navy-dark/80"
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md rounded-3xl overflow-hidden pointer-events-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Green header strip */}
              <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] px-8 pt-8 pb-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-2 border-white/30" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full border-2 border-white/20" />
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <WhatsAppIcon className="w-9 h-9 text-white" />
                  </div>
                  <h3 className="text-white text-xl font-bold font-arabic mb-1">تواصل معنا عبر واتساب</h3>
                  <p className="text-white/75 text-sm font-arabic">نحن هنا لمساعدتك في الحجز والاستفسار</p>
                </div>
              </div>

              {/* Content */}
              <div className="bg-surface border border-ink/[0.06] border-t-0 rounded-b-3xl px-8 pt-6 pb-8 -mt-4 relative z-10">
                <div className="bg-subtle rounded-2xl p-5 mb-6 border border-ink/[0.04]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
                      <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                    </div>
                    <div>
                      <p className="text-ink font-arabic font-bold text-sm">إدارة نوادي وفنادق المدفعية</p>
                      <p className="text-muted text-xs font-arabic">داي يوز / حجز إسكان</p>
                    </div>
                  </div>

                  <div className="bg-page rounded-xl p-4 border border-ink/[0.04]">
                    <p className="text-muted text-sm font-arabic leading-relaxed text-right">
                      مرحباً بك! 👋
                      <br />
                      يسعدنا خدمتك، تواصل معنا الآن للحجز أو الاستفسار عن خدماتنا الفندقية.
                    </p>
                  </div>
                </div>

                <a
                  href="https://wa.me/201090900516?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A7%D9%84%D8%AD%D8%AC%D8%B2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#1ebe57] text-white font-arabic font-bold text-base transition-colors duration-200 shadow-[0_8px_24px_rgba(37,211,102,0.3)]"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  ابدأ المحادثة
                </a>

                <p className="text-center text-faint text-xs font-arabic mt-4" dir="ltr">
                  01090900516
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/80 hover:text-white transition-colors duration-200 text-sm"
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

export default WhatsAppPopup;
