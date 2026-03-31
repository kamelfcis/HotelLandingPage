import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import HotelShowcase from './components/HotelShowcase';
import Navbar from './components/Navbar';
import FloatingButtons from './components/FloatingButtons';
import WhatsAppPopup from './components/WhatsAppPopup';

function App() {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  return (
    <main className="min-h-screen bg-navy selection:bg-gold/30 selection:text-gold overflow-hidden">
      <Navbar onBookNow={() => setShowBooking(true)} />
      <Hero />
      <BentoGrid onSelectHotel={(hotel) => setSelectedHotel(hotel)} />

      {/* Footer */}
      <footer id="contact" className="relative py-16 md:py-28 border-t border-white/[0.04] z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center space-y-5 mb-12">
            <img src="/assets/logo.jpeg" alt="Logo" className="w-9 h-9 rounded-xl object-cover mx-auto shadow-lg shadow-gold/15" />
            <h3 className="text-gold font-arabic font-bold text-lg">للحجز والاستفسار</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-12">
            {/* WhatsApp / Day Use */}
            <a
              href="https://wa.me/201090900516"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center group-hover:bg-[#25D366]/25 transition-colors duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="text-right">
                <span className="block text-white/50 text-xs font-arabic">داي يوز / واتساب</span>
                <span className="block text-white font-inter text-sm tracking-wider ltr" dir="ltr">01090900516</span>
              </div>
            </a>

            <div className="hidden sm:block w-px h-10 bg-white/[0.06]" />

            {/* Phone - Booking */}
            <a
              href="tel:0222910609"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gold">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div className="text-right">
                <span className="block text-white/50 text-xs font-arabic">حجز إسكان - دار ضباط المدفعية</span>
                <span className="block text-white font-inter text-sm tracking-wider ltr" dir="ltr">0222910609</span>
              </div>
            </a>
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-gold/15" />
              ))}
            </div>
            <p className="text-white/20 text-sm font-arabic">
              حقوق الطبع والنشر © ٢٠٢٦ - إدارة نوادي وفنادق المدفعية
            </p>
          </div>
        </div>
      </footer>

      {/* Hotel Showcase Overlay */}
      <AnimatePresence>
        {selectedHotel && (
          <HotelShowcase
            selectedHotel={selectedHotel}
            onBack={() => setSelectedHotel(null)}
          />
        )}
      </AnimatePresence>

      {/* Floating Social Buttons */}
      <FloatingButtons />

      {/* WhatsApp Booking Popup */}
      <WhatsAppPopup isOpen={showBooking} onClose={() => setShowBooking(false)} />

      {/* Global Ambient Lighting — hidden on mobile for performance */}
      <div className="hidden md:block fixed top-[-15%] right-[-15%] w-[35vw] h-[35vw] rounded-full bg-gold/4 blur-[100px] pointer-events-none z-0" />
    </main>
  );
}

export default App;
