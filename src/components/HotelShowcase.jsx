import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageSlider from './ImageSlider';
import { cn } from '../lib/utils';
import { Sparkles, Star, Shield, ArrowRight } from 'lucide-react';

const stagger = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const HotelShowcase = ({ selectedHotel, onBack }) => {
  const [activeCategory, setActiveCategory] = useState(
    selectedHotel.categories[0].id
  );

  const currentCategory = selectedHotel.categories.find(
    (c) => c.id === activeCategory
  );

  const infoCards = [
    {
      icon: Sparkles,
      title: 'إطلالة بانورامية',
      desc: 'نوافذ واسعة تطل على أفضل المناظر الطبيعية',
    },
    {
      icon: Star,
      title: 'خدمة ملكية',
      desc: 'طاقم عمل مخصص لراحتك على مدار الساعة',
    },
    {
      icon: Shield,
      title: 'رفاهية متكاملة',
      desc: 'أحدث التجهيزات والكماليات لضمان إقامة متميزة',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 80, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.98 }}
      transition={{ type: 'spring', damping: 28, stiffness: 130 }}
      className="fixed inset-0 z-50 bg-navy overflow-y-auto overflow-x-hidden safe-area-padding"
    >
      {/* ── Ambient Background Layer ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="ambient-orb w-[600px] h-[600px] bg-gold/5 -top-[10%] -right-[5%]" />
        <div
          className="ambient-orb w-[500px] h-[500px] bg-navy-light/40 -bottom-[10%] -left-[15%]"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="ambient-orb w-[350px] h-[350px] bg-gold/[0.03] top-[40%] left-[25%]"
          style={{ animationDelay: '7s' }}
        />

        {/* Subtle luxury grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.25) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* ── Content with Stagger Reveal ── */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-10"
      >
        {/* Back Button */}
        <motion.button
          variants={fadeUp}
          whileHover={{ x: -10 }}
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
          className="flex items-center gap-3 text-gold font-arabic font-bold group mb-8 md:mb-12"
        >
          <div className="w-8 h-[2px] bg-gold group-hover:w-16 transition-all duration-600" />
          <span className="text-sm">العودة للوجهات الرئيسية</span>
        </motion.button>

        {/* Header Section — Centered */}
        <motion.div
          variants={fadeUp}
          className="text-center mb-8 md:mb-12 space-y-3 md:space-y-5"
        >
          <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-arabic text-white leading-tight">
            {selectedHotel.displayName}
          </h2>
          <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full mx-auto" />
          <p className="text-white/50 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-arabic leading-relaxed">
            {selectedHotel.description}
          </p>
        </motion.div>

        {/* Premium Category Selector — Centered & Responsive */}
        <motion.div variants={fadeUp} className="mb-10 md:mb-16">
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap justify-center gap-2 md:gap-2.5 p-2 md:p-2.5 rounded-2xl md:rounded-3xl glass-strong border border-white/[0.06] font-arabic max-w-full">
              {selectedHotel.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'relative px-4 sm:px-6 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl transition-all duration-500 text-sm md:text-base flex items-center gap-2',
                    activeCategory === cat.id
                      ? 'text-navy font-bold shadow-lg shadow-gold/20'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                  )}
                >
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="showcaseActiveTab"
                      className="absolute inset-0 bg-gradient-to-br from-gold to-gold-dark rounded-xl md:rounded-2xl z-[-1]"
                      transition={{
                        type: 'spring',
                        bounce: 0.15,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span>{cat.name}</span>
                  <span
                    className={cn(
                      'text-[10px] md:text-[11px] min-w-[1.35rem] px-1.5 py-0.5 rounded-full text-center tabular-nums transition-colors duration-500',
                      activeCategory === cat.id
                        ? 'bg-navy/20 text-navy/70'
                        : 'bg-white/[0.06] text-white/25'
                    )}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── The "Wonder" Gallery ── */}
        <motion.div variants={fadeUp} className="relative mb-16 md:mb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(12px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-6 md:mb-8 flex items-center gap-4">
                <span className="hidden md:block w-14 h-px bg-gold/25" />
                <h4 className="text-lg sm:text-xl md:text-2xl font-arabic font-bold text-gold">
                  اكتشـف {currentCategory?.name}
                </h4>
                <span className="w-14 h-px bg-gold/25" />
              </div>

              <ImageSlider images={currentCategory?.images || []} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── Feature Info Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-12">
          {infoCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -8, borderColor: 'rgba(212,175,55,0.15)' }}
                className="p-5 md:p-8 rounded-2xl md:rounded-3xl glass border border-white/[0.04] transition-all duration-600 group"
              >
                <div className="w-11 h-11 rounded-xl bg-gold/[0.08] flex items-center justify-center mb-5 group-hover:bg-gold/[0.15] transition-colors duration-500">
                  <Icon size={19} className="text-gold" />
                </div>
                <h5 className="text-gold font-arabic font-bold text-base md:text-lg mb-2">
                  {card.title}
                </h5>
                <p className="text-white/30 text-sm font-arabic leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HotelShowcase;
