import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Navbar = ({ onBookNow }) => {
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 transition-[padding,background,box-shadow] duration-500',
        scrolled
          ? 'py-3 glass-strong shadow-lg shadow-ink/5'
          : 'py-5 bg-transparent'
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <img src="/assets/logo.jpeg" alt="Logo" className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-gold/20" />
        <div className="leading-tight">
          <h1 className="text-base md:text-lg font-bold font-inter tracking-wider">
            <span className={scrolled ? 'text-ink' : 'text-white'}>Artillery </span>
            <span className="text-gold">Hotels</span>
          </h1>
          <span className={cn(
            'text-[9px] font-arabic tracking-widest hidden sm:block transition-colors duration-300',
            scrolled ? 'text-muted' : 'text-white/40'
          )}>
            نوادي و فنادق المدفعية
          </span>
        </div>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden lg:flex items-center gap-10 font-arabic">
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
            className={cn(
              'relative text-sm font-medium py-2 hover:text-gold transition-colors duration-300 group',
              scrolled ? 'text-muted' : 'text-white/60'
            )}
          >
            {item.label}
            <span className="absolute bottom-0 left-0 right-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300',
            scrolled
              ? 'bg-subtle text-muted hover:text-gold'
              : 'bg-white/10 text-white/60 hover:text-gold'
          )}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBookNow}
          className="px-5 md:px-7 py-2 md:py-2.5 bg-gold/[0.08] border border-gold/25 text-gold rounded-full text-xs md:text-sm font-arabic font-bold hover:bg-gold hover:text-navy transition-colors duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          احجز الآن
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
