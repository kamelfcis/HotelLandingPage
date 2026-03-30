import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_IMAGES = [
  '/assets/nada.jpg',
  '/assets/rocketbeach.jpg',
  encodeURI('/assets/فندق كينج توت.jpg'),
];

const SLIDE_DURATION = 6000;

const Hero = () => {
  const title = 'نوادي و فنادق المدفعية';
  const words = title.split(' ');
  const bgRef = useRef(null);
  const [current, setCurrent] = useState(0);

  /* ── Auto-cycle hero images ── */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  /* ── Parallax: moves background at 35% of scroll speed ── */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (bgRef.current) {
            bgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
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
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* ── Parallax + Ken Burns Background Slideshow ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          ref={bgRef}
          className="absolute inset-[-15%] will-change-transform"
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            >
              <img
                src={HERO_IMAGES[current]}
                alt=""
                className="w-full h-full object-cover hero-zoom-img"
                style={{ animationDuration: `${SLIDE_DURATION}ms` }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Preload all images */}
          {HERO_IMAGES.map((src, i) => (
            <img key={`preload-${i}`} src={src} alt="" className="hidden" />
          ))}
        </div>
      </div>

      {/* ── Multi-layer Gradient Overlays ── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-navy/75 via-navy/25 to-navy" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-navy/60 via-transparent to-navy/60" />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(10,25,47,0.55) 75%)',
        }}
      />

      {/* ── Floating Geometric Decorations ── */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[12%] right-[8%] w-36 h-36 border border-gold/[0.06] rotate-45"
          animate={{ rotate: [45, 405] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-[18%] right-[13%] w-20 h-20 border border-gold/[0.04] rotate-45"
          animate={{ rotate: [45, -315] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-[22%] left-[5%] w-44 h-44 border border-gold/[0.05] rotate-45"
          animate={{ rotate: [45, 405] }}
          transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-[32%] right-[18%] w-14 h-14 border border-gold/[0.04] rotate-45"
          animate={{ rotate: [45, -315] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating golden particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[3px] h-[3px] rounded-full bg-gold/20"
            style={{
              top: `${10 + ((i * 11) % 75)}%`,
              left: `${5 + ((i * 13) % 88)}%`,
            }}
            animate={{
              y: [0, -28 - i * 3, 0],
              opacity: [0.08, 0.35, 0.08],
            }}
            transition={{
              duration: 4.5 + i * 0.7,
              repeat: Infinity,
              delay: i * 0.45,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Ambient light orbs */}
        <div className="ambient-orb w-[500px] h-[500px] bg-gold/[0.04] -top-[10%] -right-[5%]" />
        <div
          className="ambient-orb w-[400px] h-[400px] bg-gold/[0.025] bottom-[5%] -left-[10%]"
          style={{ animationDelay: '5s' }}
        />
      </div>

      {/* ── Content ── */}
      <div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        style={{ perspective: '1200px' }}
      >
        {/* Upper decorative line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-28 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-10"
        />

        {/* Split-Text Title Reveal */}
        <div className="flex flex-row-reverse gap-3 md:gap-5 justify-center items-center flex-wrap">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{
                opacity: 0,
                y: 55,
                rotateX: -50,
                filter: 'blur(14px)',
              }}
              animate={{
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: 'blur(0px)',
              }}
              transition={{
                delay: i * 0.18 + 0.45,
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold font-arabic text-white"
              style={{
                textShadow:
                  '0 4px 40px rgba(0,0,0,0.5), 0 0 100px rgba(212,175,55,0.08)',
                transformOrigin: 'center bottom',
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 md:mt-9 text-gold/85 text-lg sm:text-xl md:text-2xl font-arabic tracking-wider"
          style={{ textShadow: '0 2px 24px rgba(212,175,55,0.25)' }}
        >
          أرقى الوجهات والخدمات الفندقية للقوات المسلحة
        </motion.p>

        {/* Lower decorative line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.6, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-44 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent mx-auto mt-9"
        />

        {/* Slide Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-10 md:mt-14 flex items-center justify-center gap-2.5"
        >
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="relative group p-1"
            >
              <div
                className={`h-[3px] rounded-full transition-all duration-700 ease-out ${
                  i === current
                    ? 'w-10 bg-gold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                    : 'w-5 bg-white/20 group-hover:bg-white/40'
                }`}
              />
              {i === current && (
                <motion.div
                  className="absolute inset-x-1 top-1 h-[3px] rounded-full bg-gold-light/60"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
                  key={`progress-${current}`}
                  style={{ transformOrigin: 'left' }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          className="mt-10 md:mt-14 flex flex-col items-center gap-3"
        >
          <motion.span
            className="text-white/20 text-[10px] font-arabic tracking-[0.25em]"
            animate={{ opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            اكتشف المزيد
          </motion.span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-px h-14 bg-gradient-to-b from-gold/60 to-transparent"
          />
        </motion.div>
      </div>

      {/* Bottom fade to navy */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-navy to-transparent z-[3]" />
    </section>
  );
};

export default Hero;
