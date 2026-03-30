import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 transition-all duration-700',
        scrolled
          ? 'py-3 glass-strong shadow-2xl shadow-navy-dark/50'
          : 'py-5 bg-transparent'
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <img src="/assets/logo.jpeg" alt="Logo" className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-gold/20" />
        <div className="leading-tight">
          <h1 className="text-base md:text-lg font-bold font-inter text-white tracking-wider">
            Artillery <span className="text-gold">Hotels</span>
          </h1>
          <span className="text-[9px] text-white/25 font-arabic tracking-widest hidden sm:block">
            نوادي و فنادق المدفعية
          </span>
        </div>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden lg:flex items-center gap-10 font-arabic text-white/55">
        {[
          { label: 'الرئيسية', href: '#' },
          { label: 'وجهاتنا', href: '#destinations' },
          { label: 'عن الإدارة', href: '#about' },
          { label: 'اتصل بنا', href: '#contact' },
        ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                const target = item.href === '#' ? document.body : document.querySelector(item.href);
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="relative text-sm font-medium py-2 hover:text-gold transition-colors duration-300 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 right-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
            </a>
          ))}
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-5 md:px-7 py-2 md:py-2.5 bg-gold/[0.08] border border-gold/25 text-gold rounded-full text-xs md:text-sm font-arabic font-bold hover:bg-gold hover:text-navy transition-all duration-600 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
      >
        احجز الآن
      </motion.button>
    </motion.nav>
  );
};

export default Navbar;
