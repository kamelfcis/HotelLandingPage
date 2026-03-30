import React, { useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Pause, Play, Expand } from 'lucide-react';
import { cn } from '../lib/utils';

const AUTOPLAY_MS = 5000;

const ImageSlider = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [fullscreenSrc, setFullscreenSrc] = useState(null);
  const touchStart = useRef(null);
  const touchDelta = useRef(0);

  const shouldPlay = isAutoPlaying && !isPaused && !fullscreenSrc;

  const safeSrc = (src) => {
    try {
      return decodeURI(src) === src ? encodeURI(src) : src;
    } catch {
      return encodeURI(src);
    }
  };

  const goTo = useCallback(
    (index, dir) => {
      setDirection(dir ?? (index > selectedIndex ? 1 : -1));
      setSelectedIndex(((index % images.length) + images.length) % images.length);
    },
    [selectedIndex, images.length]
  );

  const scrollPrev = useCallback(() => goTo(selectedIndex - 1, -1), [goTo, selectedIndex]);
  const scrollNext = useCallback(() => goTo(selectedIndex + 1, 1), [goTo, selectedIndex]);

  useEffect(() => {
    if (!shouldPlay || images.length <= 1) return;
    const id = setTimeout(() => scrollNext(), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [shouldPlay, selectedIndex, images.length, scrollNext]);

  useEffect(() => {
    const onKey = (e) => {
      if (fullscreenSrc) return;
      if (e.key === 'ArrowLeft') scrollNext();
      if (e.key === 'ArrowRight') scrollPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [scrollPrev, scrollNext, fullscreenSrc]);

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
    touchDelta.current = 0;
  };

  const handleTouchMove = (e) => {
    if (touchStart.current !== null) {
      touchDelta.current = e.touches[0].clientX - touchStart.current;
    }
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDelta.current) > 50) {
      if (touchDelta.current > 0) scrollPrev();
      else scrollNext();
    }
    touchStart.current = null;
    touchDelta.current = 0;
  };

  if (!images || images.length === 0) return null;

  const slideVariants = {
    enter: (dir) => ({ x: `${dir * 100}%`, opacity: 0.4 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: `${-dir * 100}%`, opacity: 0.4 }),
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto space-y-5">
        {/* Main Slide Area */}
        <div
          className="relative group rounded-[1.75rem] overflow-hidden border border-white/[0.06] bg-navy-dark slider-shadow"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {shouldPlay && images.length > 1 && (
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/[0.04] z-30">
              <div
                key={`p-${selectedIndex}`}
                className="h-full bg-gradient-to-r from-gold via-gold-light to-gold rounded-full"
                style={{ animation: `slideProgress ${AUTOPLAY_MS}ms linear forwards` }}
              />
            </div>
          )}

          <div className="relative h-[280px] sm:h-[400px] md:h-[520px] lg:h-[600px]">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={selectedIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0 cursor-zoom-in"
                onClick={() => setFullscreenSrc(safeSrc(images[selectedIndex]))}
              >
                <img
                  src={safeSrc(images[selectedIndex])}
                  alt={`Slide ${selectedIndex + 1}`}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 via-transparent to-navy-dark/10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/10 via-transparent to-navy-dark/10 pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 opacity-0 group-hover:opacity-60 transition-opacity duration-500">
              <Expand size={18} className="text-white" />
            </div>
          </div>

          {images.length > 1 && (
            <div className="absolute inset-y-0 left-3 right-3 md:left-6 md:right-6 flex items-center justify-between pointer-events-none z-20">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.88 }}
                className="slider-nav-btn pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                onClick={scrollPrev}
              >
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.88 }}
                className="slider-nav-btn pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                onClick={scrollNext}
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 z-20 px-4 md:px-7 pb-4 md:pb-6 flex items-end justify-between">
            {images.length > 1 ? (
              <button
                onClick={() => setIsAutoPlaying((p) => !p)}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-navy/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-gold/60 hover:text-gold transition-colors duration-300"
              >
                {isAutoPlaying ? <Pause size={13} /> : <Play size={13} />}
              </button>
            ) : (
              <div />
            )}

            {images.length > 1 && (
              <div className="flex items-center gap-1.5 md:gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={cn(
                      'rounded-full transition-all duration-500',
                      selectedIndex === i
                        ? 'w-7 md:w-9 h-2 md:h-2.5 bg-gold shadow-[0_0_14px_rgba(212,175,55,0.5)]'
                        : 'w-2 h-2 md:w-2.5 md:h-2.5 bg-white/20 hover:bg-white/40'
                    )}
                  />
                ))}
              </div>
            )}

            <div className="bg-navy/45 backdrop-blur-xl px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-white/[0.08] text-[11px] md:text-xs font-inter text-gold/70 tabular-nums tracking-wider">
              {String(selectedIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 md:gap-2.5 overflow-x-auto py-2 px-2 no-scrollbar">
            {images.map((src, index) => (
              <motion.button
                key={index}
                onClick={() => goTo(index)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.93 }}
                className={cn(
                  'relative flex-shrink-0 w-12 h-9 md:w-[5.5rem] md:h-14 rounded-lg md:rounded-xl overflow-hidden border-2 transition-all duration-500',
                  selectedIndex === index
                    ? 'border-gold shadow-[0_0_20px_rgba(212,175,55,0.25)] ring-1 ring-gold/15'
                    : 'border-white/[0.04] opacity-35 hover:opacity-75 grayscale hover:grayscale-0'
                )}
              >
                <img
                  src={safeSrc(src)}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {fullscreenSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-navy-dark/95 backdrop-blur-2xl flex items-center justify-center cursor-zoom-out p-4"
            onClick={() => setFullscreenSrc(null)}
          >
            <motion.img
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 140 }}
              src={fullscreenSrc}
              alt="Fullscreen view"
              className="max-w-full max-h-[92vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setFullscreenSrc(null)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full glass-strong flex items-center justify-center text-white/70 hover:text-gold transition-colors text-xl"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageSlider;
