import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_IMAGES = [
  '/assets/nada.jpg',
  '/assets/rocketbeach.jpg',
  encodeURI('/assets/فندق كينج توت.jpg'),
];

const SLIDE_DURATION = 6000;

const Hero = () => {
  const title = 'المدفعية نوادي و فنادق ';
  const words = title.split(' ');
  const bgRef = useRef(null);
  const sectionRef = useRef(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (bgRef.current && sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            if (rect.bottom > 0) {
              bgRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.3}px, 0)`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={bgRef} className="absolute inset-[-15%]">
          <AnimatePresence mode="sync">
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              <img
                src={HERO_IMAGES[current]}
                alt=""
                className="w-full h-full object-cover hero-zoom-img"
                style={{ animationDuration: `${SLIDE_DURATION}ms` }}
              />
            </motion.div>
          </AnimatePresence>

          {HERO_IMAGES.map((src, i) => (
            <img key={`preload-${i}`} src={src} alt="" className="hidden" />
          ))}
        </div>
      </div>

      {/* Gradient Overlays — subtle darkening for text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/10 to-black/60" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      {/* Decorations — reduced to 2 shapes + 3 particles */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none hidden md:block">
        <div
          className="absolute top-[12%] right-[8%] w-36 h-36 border border-gold/[0.06] rotate-45 animate-spin-slow"
          style={{ animationDuration: '32s' }}
        />
        <div
          className="absolute bottom-[22%] left-[5%] w-44 h-44 border border-gold/[0.05] rotate-45 animate-spin-slow"
          style={{ animationDuration: '38s', animationDirection: 'reverse' }}
        />

        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute w-[3px] h-[3px] rounded-full bg-gold/20 animate-float"
            style={{
              top: `${15 + i * 25}%`,
              left: `${10 + i * 30}%`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* Content — white text always since it's over dark images */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-28 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-10"
        />

        <div className="flex flex-row-reverse gap-3 md:gap-5 justify-center items-center flex-wrap">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.15 + 0.4,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold font-arabic text-white"
              style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 md:mt-9 text-gold/85 text-lg sm:text-xl md:text-2xl font-arabic tracking-wider"
          style={{ textShadow: '0 2px 24px rgba(212,175,55,0.25)' }}
        >
          أرقى الوجهات والخدمات الفندقية للقوات المسلحة
        </motion.p>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-44 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent mx-auto mt-9"
        />

        {/* Slide Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="mt-10 md:mt-14 flex items-center justify-center gap-2.5"
        >
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="relative group p-1"
            >
              <div
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  i === current
                    ? 'w-10 bg-gold'
                    : 'w-5 bg-white/20 group-hover:bg-white/40'
                }`}
              />
            </button>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="mt-10 md:mt-14 flex flex-col items-center gap-3"
        >
          <span className="text-white/20 text-[10px] font-arabic tracking-[0.25em]">
            اكتشف المزيد
          </span>
          <div className="w-px h-14 bg-gradient-to-b from-gold/60 to-transparent animate-bounce" style={{ animationDuration: '2s' }} />
        </motion.div>
      </div>

      {/* Bottom edge — crisp decorative divider */}
      <div className="absolute bottom-0 left-0 right-0 z-[3]">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-16 md:h-20 block">
          <path d="M0 80V40C240 0 480 20 720 40C960 60 1200 20 1440 0V80H0Z" className="fill-page" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
