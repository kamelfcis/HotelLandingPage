import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { hotels } from '../data/hotels';
import { cn } from '../lib/utils';
import { Eye, ArrowLeft } from 'lucide-react';

const BentoGrid = ({ onSelectHotel }) => {
  const cardRefs = useRef([]);
  const glareRefs = useRef([]);

  /**
   * 3D Tilt: rotates card based on mouse position within the element.
   * Also moves a radial-gradient "glare" spotlight to the cursor position.
   */
  const handleMouseMove = useCallback((e, index) => {
    const card = cardRefs.current[index];
    const glare = glareRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (y - 0.5) * -14;
    const rotateY = (x - 0.5) * 14;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;

    if (glare) {
      glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(212,175,55,0.1) 0%, transparent 55%)`;
      glare.style.opacity = '1';
    }
  }, []);

  const handleMouseLeave = useCallback((index) => {
    const card = cardRefs.current[index];
    const glare = glareRefs.current[index];
    if (card) {
      card.style.transform =
        'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (glare) {
      glare.style.opacity = '0';
    }
  }, []);

  return (
    <section
      className="relative py-24 md:py-36 px-4 sm:px-6 md:px-12"
      id="destinations"
    >
      {/* Section ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="ambient-orb w-[650px] h-[650px] bg-gold/5 -top-[200px] -right-[220px]" />
        <div
          className="ambient-orb w-[500px] h-[500px] bg-navy-light/35 bottom-[-120px] -left-[200px]"
          style={{ animationDelay: '5s' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-right mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <span className="text-gold/45 text-sm font-arabic tracking-widest mb-4 block">
              وجهاتنا المتميزة
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-arabic font-bold text-white leading-tight">
              اختر <span className="text-gradient-gold">وجهتك</span>
            </h2>
            <div className="h-1 w-20 md:w-24 bg-gradient-to-l from-gold to-transparent rounded-full mt-5 mr-0 ml-auto" />
          </motion.div>
        </div>

        {/* 3D Tilt Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.12,
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true }}
              className="cursor-pointer"
              onClick={() => onSelectHotel(hotel)}
            >
              <div
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => handleMouseLeave(index)}
                className="tilt-card relative h-[400px] sm:h-[480px] rounded-3xl overflow-hidden border border-white/[0.06] group card-shadow"
              >
                {/* Hotel Image */}
                <img
                  src={encodeURI(hotel.heroImage)}
                  alt={hotel.displayName}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent z-10 opacity-90 group-hover:opacity-70 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-br from-navy/20 to-transparent z-10" />

                {/* Mouse-follow glare spotlight */}
                <div
                  ref={(el) => {
                    glareRefs.current[index] = el;
                  }}
                  className="absolute inset-0 z-20 opacity-0 transition-opacity duration-500 pointer-events-none"
                />

                {/* Hover inner glow */}
                <div className="absolute inset-0 rounded-3xl z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-[inset_0_0_50px_rgba(212,175,55,0.06)]" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-30 text-right">
                  {/* Category count badge */}
                  <div className="inline-flex items-center gap-2 glass-gold px-3 py-1 rounded-full mb-4 text-gold text-xs font-arabic">
                    <Eye size={12} />
                    {hotel.categories.length} أقسام
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-arabic font-bold text-white mb-2 group-hover:text-gold transition-colors duration-500">
                    {hotel.displayName}
                  </h3>
                  <p className="text-white/40 text-sm font-arabic line-clamp-2 leading-relaxed group-hover:text-white/60 transition-colors duration-500">
                    {hotel.description}
                  </p>

                  {/* Explore CTA */}
                  <div className="mt-6 flex items-center justify-end gap-3">
                    <span className="text-sm font-arabic text-gold font-bold">
                      استكشف الآن
                    </span>
                    <ArrowLeft
                      size={16}
                      className="text-gold group-hover:-translate-x-2 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
