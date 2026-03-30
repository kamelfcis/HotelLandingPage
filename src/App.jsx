import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import HotelShowcase from './components/HotelShowcase';
import Navbar from './components/Navbar';
import FloatingButtons from './components/FloatingButtons';

function App() {
  const [selectedHotel, setSelectedHotel] = useState(null);

  return (
    <main className="min-h-screen bg-navy selection:bg-gold/30 selection:text-gold overflow-hidden">
      <Navbar />
      <Hero />
      <BentoGrid onSelectHotel={(hotel) => setSelectedHotel(hotel)} />

      {/* Footer */}
      <footer className="relative py-16 md:py-28 border-t border-white/[0.04] text-center z-10">
        <div className="max-w-4xl mx-auto px-4 space-y-5">
          <img src="/assets/logo.jpeg" alt="Logo" className="w-9 h-9 rounded-xl object-cover mx-auto shadow-lg shadow-gold/15" />
          <p className="text-white/20 text-sm font-arabic">
            حقوق الطبع والنشر © ٢٠٢٦ - إدارة نوادي وفنادق المدفعية
          </p>
          <div className="flex justify-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-gold/15" />
            ))}
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

      {/* Global Ambient Lighting */}
      <div className="fixed top-[-15%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-gold/5 blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-[-15%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-navy-light/30 blur-[160px] pointer-events-none z-0" />
    </main>
  );
}

export default App;
