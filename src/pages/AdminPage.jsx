import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { HOTEL_DEFINITIONS } from '../data/hotelDefinitions';
import {
  fetchCategoryImagesForAdmin,
  uploadCategoryImage,
  deleteCategoryImage,
  setHotelHeroImage,
  fetchHotelHeroImage,
  fetchHeroSlidesForAdmin,
  uploadHeroSlide,
  deleteHeroSlide,
  HERO_SLIDES_MAX,
} from '../services/hotelsService';
import { cn } from '../lib/utils';
import {
  LogOut,
  Upload,
  Trash2,
  Loader2,
  ImageIcon,
  ChevronLeft,
  Hotel,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Star,
  GalleryHorizontalEnd,
  Images,
  X,
  ZoomIn,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

function isAdminUser(user) {
  return user?.app_metadata?.role === 'admin';
}

/* ── lightbox ──────────────────────────────────────────────────── */
function Lightbox({ url, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!url) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* blurred dark backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
        aria-label="إغلاق"
      >
        <X size={18} />
      </button>

      {/* hint */}
      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-white/30 pointer-events-none hidden sm:block">
        اضغط في أي مكان أو Esc للإغلاق
      </p>

      {/* image */}
      <div
        className="relative z-10 max-w-[95vw] max-h-[90vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={url}
          alt=""
          className="block max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain rounded-2xl shadow-2xl border border-white/10"
          style={{ boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)' }}
        />
      </div>
    </div>,
    document.body
  );
}

/* ── tiny toast system ─────────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  return { toasts, add };
}

function Toasts({ toasts }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium shadow-xl backdrop-blur-sm pointer-events-auto animate-slide-up',
            t.type === 'success'
              ? 'bg-navy text-gold border border-gold/30'
              : 'bg-red-950 text-red-300 border border-red-500/30'
          )}
        >
          {t.type === 'success' ? (
            <CheckCircle2 size={16} className="shrink-0" />
          ) : (
            <XCircle size={16} className="shrink-0" />
          )}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ── login screen ──────────────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setError('');
    setBusy(true);
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
      if (!isAdminUser(data.user)) {
        await supabase.auth.signOut();
        setError('هذا الحساب ليس لديه صلاحية الإدارة.');
        return;
      }
      onLogin(data.session);
    } catch (e) {
      setError(e.message || 'فشل تسجيل الدخول');
    } finally {
      setBusy(false);
    }
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center font-arabic overflow-hidden relative"
      style={{ background: 'radial-gradient(ellipse at 60% 35%, #112240 0%, #0A192F 55%, #020C1B 100%)' }}
    >
      {/* animated background orbs */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.035, 0.07, 0.035] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: 'var(--gold)', filter: 'blur(80px)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.025, 0.055, 0.025] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute -bottom-40 -left-20 w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: '#1e40af', filter: 'blur(90px)' }}
      />
      <motion.div
        animate={{ y: [0, -30, 0], opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute top-1/2 left-1/3 w-[260px] h-[260px] rounded-full pointer-events-none"
        style={{ background: 'var(--gold)', filter: 'blur(70px)' }}
      />

      {/* floating dots — hidden on very small screens */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        {[
          { left: '8%',  top: '18%', delay: 0 },
          { left: '22%', top: '72%', delay: 0.5 },
          { left: '78%', top: '25%', delay: 1 },
          { left: '88%', top: '65%', delay: 1.5 },
          { left: '50%', top: '10%', delay: 0.8 },
          { left: '65%', top: '88%', delay: 0.3 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -14, 0], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: dot.delay }}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{ left: dot.left, top: dot.top, background: 'var(--gold)' }}
          />
        ))}
      </div>

      {/* card wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[360px] mx-4 sm:mx-auto"
      >
        {/* glowing border ring */}
        <motion.div
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -inset-px rounded-[26px] pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.3), transparent 60%, rgba(212,175,55,0.15))', borderRadius: 26 }}
        />

        {/* glass card */}
        <div
          className="relative rounded-3xl border border-white/[0.07] p-7 sm:p-9"
          style={{
            background: 'rgba(10,25,47,0.75)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)',
          }}
        >
          <motion.div variants={stagger} initial="hidden" animate="show">

            {/* logo block */}
            <motion.div variants={fadeUp} className="text-center mb-8">
              {/* icon with corner accents */}
              <div className="relative inline-flex mb-5">
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(212,175,55,0)',
                      '0 0 28px rgba(212,175,55,0.35)',
                      '0 0 0px rgba(212,175,55,0)',
                    ],
                  }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-[68px] h-[68px] rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center"
                >
                  <Hotel size={30} className="text-gold" />
                </motion.div>
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-gold/55 rounded-tr" />
                <span className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-gold/55 rounded-bl" />
              </div>

              <h1 className="text-2xl sm:text-[1.75rem] font-bold text-white tracking-wide leading-tight">
                لوحة التحكم
              </h1>
              <div className="h-px w-14 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mt-2.5 mb-2" />
              <p className="text-[13px] text-white/35">إدارة صور الغرف والفنادق</p>
            </motion.div>

            {/* form */}
            <form onSubmit={submit} className="space-y-4">

              {/* email */}
              <motion.div variants={fadeUp}>
                <label className="block text-[10px] font-semibold text-white/40 mb-2 tracking-[0.15em] uppercase">
                  البريد الإلكتروني
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white text-sm placeholder-white/20 outline-none focus:border-gold/50 focus:bg-white/[0.09] transition-all duration-300"
                    placeholder="admin@example.com"
                    required
                    autoComplete="email"
                  />
                  <div className="absolute inset-0 rounded-xl border border-gold/0 group-focus-within:border-gold/25 transition-colors duration-400 pointer-events-none" />
                </div>
              </motion.div>

              {/* password */}
              <motion.div variants={fadeUp}>
                <label className="block text-[10px] font-semibold text-white/40 mb-2 tracking-[0.15em] uppercase">
                  كلمة المرور
                </label>
                <div className="relative group">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 pl-12 text-white text-sm placeholder-white/20 outline-none focus:border-gold/50 focus:bg-white/[0.09] transition-all duration-300"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <div className="absolute inset-0 rounded-xl border border-gold/0 group-focus-within:border-gold/25 transition-colors duration-400 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors p-1"
                    tabIndex={-1}
                    aria-label={showPass ? 'إخفاء' : 'إظهار'}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </motion.div>

              {/* error */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="err"
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                      <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                      <p className="text-[13px] text-red-400 leading-snug">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* submit */}
              <motion.div variants={fadeUp} className="pt-1">
                <motion.button
                  type="submit"
                  disabled={busy}
                  whileHover={{ scale: busy ? 1 : 1.02, boxShadow: busy ? undefined : '0 12px 40px rgba(212,175,55,0.4)' }}
                  whileTap={{ scale: busy ? 1 : 0.97 }}
                  className="relative w-full rounded-xl bg-gold py-4 font-bold text-navy text-sm disabled:opacity-55 disabled:cursor-not-allowed overflow-hidden flex items-center justify-center gap-2 transition-shadow duration-300"
                  style={{ boxShadow: '0 8px 28px rgba(212,175,55,0.25)' }}
                >
                  {/* shimmer sweep */}
                  {!busy && (
                    <motion.span
                      animate={{ x: ['-120%', '220%'] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 pointer-events-none"
                    />
                  )}
                  {busy ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>جاري الدخول…</span>
                    </>
                  ) : (
                    <span>دخول</span>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* back link */}
            <motion.div variants={fadeUp} className="mt-7 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-[13px] text-white/25 hover:text-gold/60 transition-colors duration-300 group"
              >
                <motion.span
                  animate={{ x: [0, -4, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ChevronLeft size={14} className="text-white/20 group-hover:text-gold/50 transition-colors" />
                </motion.span>
                العودة للموقع
              </Link>
            </motion.div>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── drag-drop upload zone ─────────────────────────────────────── */
function UploadZone({ onFiles, active, percent, fileIndex, fileCount }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      /\.(jpe?g|png|webp)$/i.test(f.name)
    );
    if (files.length) onFiles(files);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !active && inputRef.current?.click()}
      className={cn(
        'relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer select-none overflow-hidden',
        active
          ? 'border-gold/40 bg-gold/5 cursor-default'
          : dragging
          ? 'border-gold bg-gold/10 scale-[1.01]'
          : 'border-white/10 bg-white/[0.02] hover:border-gold/40 hover:bg-white/[0.04]'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        disabled={active}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          e.target.value = '';
          if (files.length) onFiles(files);
        }}
      />

      <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
        {active ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Loader2 size={26} className="text-gold animate-spin" />
            </div>
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-xs text-white/50">
                <span>ملف {fileIndex} من {fileCount}</span>
                <span className="text-gold font-bold">{percent}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-dark to-gold-light rounded-full transition-all duration-200"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-xs text-white/30">جاري الرفع، لا تغلق الصفحة…</p>
            </div>
          </>
        ) : (
          <>
            <div
              className={cn(
                'w-14 h-14 rounded-2xl border flex items-center justify-center transition-colors',
                dragging
                  ? 'bg-gold/20 border-gold/40'
                  : 'bg-white/5 border-white/10'
              )}
            >
              <Upload size={24} className={dragging ? 'text-gold' : 'text-white/40'} />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">
                {dragging ? 'أفلت الصور هنا' : 'اسحب وأفلت الصور أو اضغط للاختيار'}
              </p>
              <p className="text-xs text-white/30 mt-1">JPEG · PNG · WebP</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── image card ────────────────────────────────────────────────── */
function ImageCard({ row, onDelete, deleting, isHero, onSetHero, settingHero, onPreview }) {
  return (
    <div className={cn(
      'group relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/5 border transition-all duration-300',
      isHero ? 'border-gold/60 shadow-[0_0_20px_rgba(212,175,55,0.18)]' : 'border-white/8'
    )}>
      {/* clickable image */}
      <button
        type="button"
        onClick={onPreview}
        className="absolute inset-0 w-full h-full focus:outline-none"
        aria-label="عرض الصورة"
      >
        <img
          src={row.public_url}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </button>

      {/* hero badge */}
      {isHero && (
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-navy shadow-lg z-10 pointer-events-none">
          <Star size={9} fill="currentColor" />
          الرئيسية
        </div>
      )}

      {/* zoom hint — top-left */}
      <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <ZoomIn size={13} className="text-white/80" />
      </div>

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* action buttons */}
      <div className="absolute bottom-3 inset-x-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
        {!isHero && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSetHero(); }}
            disabled={settingHero || deleting}
            className="flex-1 rounded-xl bg-gold/90 backdrop-blur-sm px-2 py-1.5 text-[11px] font-bold text-navy flex items-center justify-center gap-1 hover:bg-gold disabled:opacity-50 transition-colors"
          >
            {settingHero ? <Loader2 size={11} className="animate-spin" /> : <Star size={11} />}
            تعيين رئيسية
          </button>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          disabled={deleting || settingHero}
          className={cn(
            'rounded-xl bg-red-600/90 backdrop-blur-sm px-2 py-1.5 text-[11px] font-medium text-white flex items-center justify-center gap-1 hover:bg-red-500 disabled:opacity-50 transition-colors',
            isHero ? 'flex-1' : 'w-9'
          )}
          aria-label="حذف"
        >
          {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
          {isHero && 'حذف'}
        </button>
      </div>
    </div>
  );
}

/* ── password input with show/hide toggle ──────────────────────── */
function PasswordInput({ value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 outline-none focus:border-gold/60 transition-colors pr-4 pl-11"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
        tabIndex={-1}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

/* ── change password form ──────────────────────────────────────── */
function ChangePasswordForm({ addToast }) {
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPass.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    if (newPass !== confirm) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password: newPass });
      if (err) throw err;
      setNewPass('');
      setConfirm('');
      addToast('تم تغيير كلمة المرور بنجاح');
    } catch (e) {
      setError(e.message || 'فشل تغيير كلمة المرور');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md">
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <KeyRound size={16} className="text-gold" />
          </div>
          <div>
            <p className="font-bold text-white">تغيير كلمة المرور</p>
            <p className="text-xs text-white/35 mt-0.5">يجب أن تكون 8 أحرف على الأقل</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
              كلمة المرور الجديدة
            </label>
            <PasswordInput
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
              تأكيد كلمة المرور
            </label>
            <PasswordInput
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
              <XCircle size={15} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-gold py-3 font-bold text-navy-dark hover:bg-gold-light active:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {busy && <Loader2 size={15} className="animate-spin" />}
            {busy ? 'جاري الحفظ…' : 'حفظ كلمة المرور'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── main dashboard ────────────────────────────────────────────── */
export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'hotels' | 'settings'

  /* ── hotel images state ───────────────────────────────────────── */
  const [hotelId, setHotelId] = useState(HOTEL_DEFINITIONS[0]?.id || '');
  const [categoryKey, setCategoryKey] = useState(
    HOTEL_DEFINITIONS[0]?.categories[0]?.id || ''
  );
  const [rows, setRows] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [uploadActive, setUploadActive] = useState(false);
  const [uploadFileIndex, setUploadFileIndex] = useState(0);
  const [uploadFileCount, setUploadFileCount] = useState(0);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [actionId, setActionId] = useState(null);
  const [heroImageUrl, setHeroImageUrl] = useState(null);
  const [settingHeroId, setSettingHeroId] = useState(null);

  /* ── hero slider state ────────────────────────────────────────── */
  const [slides, setSlides] = useState([]);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [slideUploadActive, setSlideUploadActive] = useState(false);
  const [slideUploadIndex, setSlideUploadIndex] = useState(0);
  const [slideUploadCount, setSlideUploadCount] = useState(0);
  const [slideUploadPercent, setSlideUploadPercent] = useState(0);
  const [deletingSlideId, setDeletingSlideId] = useState(null);

  const [lightboxUrl, setLightboxUrl] = useState(null);
  const { toasts, add: addToast } = useToast();
  const selectedHotel = HOTEL_DEFINITIONS.find((h) => h.id === hotelId);

  const userId = session?.user?.id;
  const userIsAdmin = isAdminUser(session?.user);

  /* ── load hotel images ────────────────────────────────────────── */
  const loadImages = useCallback(async () => {
    if (!supabase || !userId || !userIsAdmin) return;
    setLoadingList(true);
    try {
      const [data, hero] = await Promise.all([
        fetchCategoryImagesForAdmin(hotelId, categoryKey),
        fetchHotelHeroImage(hotelId),
      ]);
      setRows(data);
      setHeroImageUrl(hero);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoadingList(false);
    }
  }, [hotelId, categoryKey, userId, userIsAdmin]);

  /* ── load hero slides ─────────────────────────────────────────── */
  const loadSlides = useCallback(async () => {
    if (!supabase || !userId || !userIsAdmin) return;
    setLoadingSlides(true);
    try {
      const data = await fetchHeroSlidesForAdmin();
      setSlides(data);
    } catch (e) {
      console.error(e);
      setSlides([]);
    } finally {
      setLoadingSlides(false);
    }
  }, [userId, userIsAdmin]);

  /* ── auth init ────────────────────────────────────────────────── */
  useEffect(() => {
    if (!isSupabaseConfigured) { setAuthReady(true); return; }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (event !== 'TOKEN_REFRESHED') setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userId && userIsAdmin) { loadImages(); loadSlides(); }
  }, [loadImages, loadSlides]);

  useEffect(() => {
    const h = HOTEL_DEFINITIONS.find((x) => x.id === hotelId);
    if (h?.categories?.length) {
      const still = h.categories.some((c) => c.id === categoryKey);
      if (!still) setCategoryKey(h.categories[0].id);
    }
  }, [hotelId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setRows([]);
    setSlides([]);
  };

  /* ── hotel image handlers ─────────────────────────────────────── */
  const onFiles = async (files) => {
    if (!files.length || !session) return;
    setUploadActive(true);
    setUploadFileCount(files.length);
    setUploadFileIndex(0);
    setUploadPercent(0);
    try {
      for (let i = 0; i < files.length; i++) {
        setUploadFileIndex(i + 1);
        setUploadPercent(0);
        await uploadCategoryImage(files[i], hotelId, categoryKey, setUploadPercent);
      }
      await loadImages();
      addToast(`تم رفع ${files.length} ${files.length === 1 ? 'صورة' : 'صور'} بنجاح`);
    } catch (err) {
      addToast(err.message || 'فشل الرفع', 'error');
    } finally {
      setUploadActive(false);
      setUploadPercent(0);
    }
  };

  const onDelete = async (row) => {
    if (!window.confirm('حذف هذه الصورة نهائياً؟')) return;
    setActionId(row.id);
    try {
      await deleteCategoryImage(row);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      if (heroImageUrl === row.public_url) setHeroImageUrl(null);
      addToast('تم حذف الصورة');
    } catch (err) {
      addToast(err.message || 'فشل الحذف', 'error');
    } finally {
      setActionId(null);
    }
  };

  const onSetHero = async (row) => {
    setSettingHeroId(row.id);
    try {
      await setHotelHeroImage(hotelId, row.public_url);
      setHeroImageUrl(row.public_url);
      addToast('تم تعيين الصورة الرئيسية للفندق');
    } catch (err) {
      addToast(err.message || 'فشل تعيين الصورة الرئيسية', 'error');
    } finally {
      setSettingHeroId(null);
    }
  };

  /* ── hero slide handlers ──────────────────────────────────────── */
  const onSlideFiles = async (files) => {
    if (!files.length || !session) return;
    const slotsLeft = HERO_SLIDES_MAX - slides.length;
    if (slotsLeft <= 0) {
      addToast(`الشريط ممتلئ — احذف صورة أولاً`, 'error');
      return;
    }
    const toUpload = files.slice(0, slotsLeft);
    setSlideUploadActive(true);
    setSlideUploadCount(toUpload.length);
    setSlideUploadIndex(0);
    setSlideUploadPercent(0);
    try {
      for (let i = 0; i < toUpload.length; i++) {
        setSlideUploadIndex(i + 1);
        setSlideUploadPercent(0);
        await uploadHeroSlide(toUpload[i], setSlideUploadPercent);
      }
      await loadSlides();
      addToast(`تم رفع ${toUpload.length} ${toUpload.length === 1 ? 'صورة' : 'صور'} للشريط الرئيسي`);
    } catch (err) {
      addToast(err.message || 'فشل الرفع', 'error');
    } finally {
      setSlideUploadActive(false);
      setSlideUploadPercent(0);
    }
  };

  const onDeleteSlide = async (row) => {
    if (!window.confirm('حذف هذه الصورة من الشريط الرئيسي نهائياً؟')) return;
    setDeletingSlideId(row.id);
    try {
      await deleteHeroSlide(row);
      setSlides((prev) => prev.filter((r) => r.id !== row.id));
      addToast('تم حذف الصورة من الشريط الرئيسي');
    } catch (err) {
      addToast(err.message || 'فشل الحذف', 'error');
    } finally {
      setDeletingSlideId(null);
    }
  };

  /* ── guards ───────────────────────────────────────────────────── */
  if (!isSupabaseConfigured) {
    return (
      <div dir="rtl" className="min-h-screen bg-navy flex items-center justify-center p-8 font-arabic text-white text-center">
        <div>
          <p className="text-white/50 mb-2">لم يتم ضبط Supabase.</p>
          <p className="text-sm text-white/30 mb-6">أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env</p>
          <Link to="/" className="text-gold underline">العودة للموقع</Link>
        </div>
      </div>
    );
  }

  if (!authReady) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!session?.user || !userIsAdmin) {
    return <LoginScreen onLogin={setSession} />;
  }

  /* ── dashboard ────────────────────────────────────────────────── */
  return (
    <div
      dir="rtl"
      className="min-h-screen font-arabic text-white pb-20"
      style={{ background: 'radial-gradient(ellipse at 70% 10%, #112240 0%, #0A192F 50%, #020C1B 100%)' }}
    >
      <Toasts toasts={toasts} />
      {lightboxUrl && <Lightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}

      {/* top nav */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-navy-dark/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
            <LayoutGrid size={15} className="text-gold" />
          </div>
          <span className="font-bold text-white tracking-wide">لوحة التحكم</span>
          <span className="hidden sm:inline text-xs text-white/30 border border-white/10 rounded-full px-2.5 py-0.5">
            {session.user.email}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-gold/80 transition-colors px-2">
            <ChevronLeft size={14} />
            الموقع
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 hover:text-white hover:border-white/20 transition-colors"
          >
            <LogOut size={15} />
            خروج
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">

        {/* ── section tabs ── */}
        <div className="flex gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/8 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={cn(
              'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200',
              activeTab === 'hero'
                ? 'bg-gold text-navy shadow-[0_0_16px_rgba(212,175,55,0.3)]'
                : 'text-white/50 hover:text-white/80'
            )}
          >
            <GalleryHorizontalEnd size={16} />
            الشريط الرئيسي
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hotels')}
            className={cn(
              'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200',
              activeTab === 'hotels'
                ? 'bg-gold text-navy shadow-[0_0_16px_rgba(212,175,55,0.3)]'
                : 'text-white/50 hover:text-white/80'
            )}
          >
            <Images size={16} />
            صور الفنادق
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={cn(
              'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200',
              activeTab === 'settings'
                ? 'bg-gold text-navy shadow-[0_0_16px_rgba(212,175,55,0.3)]'
                : 'text-white/50 hover:text-white/80'
            )}
          >
            <KeyRound size={16} />
            الإعدادات
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════
            TAB: HERO SLIDER
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            {/* info + capacity bar */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                  <GalleryHorizontalEnd size={16} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-white">الشريط الرئيسي للصفحة</p>
                    <span className={cn(
                      'text-xs font-bold rounded-full px-2.5 py-0.5 border shrink-0',
                      slides.length >= HERO_SLIDES_MAX
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-gold/10 border-gold/20 text-gold'
                    )}>
                      {slides.length} / {HERO_SLIDES_MAX}
                    </span>
                  </div>
                  <p className="text-xs text-white/35 mt-1 leading-relaxed">
                    يمكنك رفع <span className="text-gold/70">3 صور بالضبط</span> تظهر متناوبة في الخلفية أعلى الصفحة الرئيسية. أفضل قياس: <span className="text-gold/70">1920 × 1080</span>. احذف صورة لاستبدالها.
                  </p>
                  {/* capacity progress */}
                  <div className="mt-3 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        slides.length >= HERO_SLIDES_MAX ? 'bg-amber-500' : 'bg-gradient-to-r from-gold-dark to-gold-light'
                      )}
                      style={{ width: `${(slides.length / HERO_SLIDES_MAX) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <section>
              <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4">رفع صورة جديدة</p>
              {slides.length >= HERO_SLIDES_MAX ? (
                <div className="rounded-2xl border-2 border-dashed border-amber-500/20 bg-amber-500/5 p-8 flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <GalleryHorizontalEnd size={20} className="text-amber-400" />
                  </div>
                  <p className="text-sm font-medium text-amber-400">الشريط ممتلئ — {HERO_SLIDES_MAX}/{HERO_SLIDES_MAX} صور</p>
                  <p className="text-xs text-white/30">احذف إحدى الصور أدناه لتتمكن من رفع صورة جديدة</p>
                </div>
              ) : (
                <UploadZone
                  onFiles={onSlideFiles}
                  active={slideUploadActive}
                  percent={slideUploadPercent}
                  fileIndex={slideUploadIndex}
                  fileCount={slideUploadCount}
                />
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-medium text-white/40 uppercase tracking-widest">صور الشريط</p>
                {!loadingSlides && (
                  <span className="text-xs text-white/30 border border-white/10 rounded-full px-3 py-1">
                    {slides.length} {slides.length === 1 ? 'صورة' : 'صور'}
                  </span>
                )}
              </div>

              {loadingSlides ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-gold/60" />
                  <p className="text-sm text-white/30">جاري التحميل…</p>
                </div>
              ) : slides.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl border border-dashed border-white/8">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <GalleryHorizontalEnd size={24} className="text-white/20" />
                  </div>
                  <p className="text-sm text-white/30">لا توجد صور في الشريط — ارفع صورة للبدء</p>
                  <p className="text-xs text-white/20">الصور الافتراضية ستظهر تلقائياً حتى تضيف صوراً</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {slides.map((row, i) => (
                    <div
                      key={row.id}
                      className="group relative aspect-video overflow-hidden rounded-2xl bg-white/5 border border-white/8"
                    >
                      {/* clickable image */}
                      <button
                        type="button"
                        onClick={() => setLightboxUrl(row.public_url)}
                        className="absolute inset-0 w-full h-full focus:outline-none"
                        aria-label="عرض الصورة"
                      >
                        <img
                          src={row.public_url}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </button>

                      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* zoom hint */}
                      <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <ZoomIn size={13} className="text-white/80" />
                      </div>

                      <div className="absolute top-2 right-2 rounded-full bg-navy-dark/70 backdrop-blur-sm px-2 py-0.5 text-[10px] text-white/60 border border-white/10 pointer-events-none z-10">
                        #{i + 1}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDeleteSlide(row); }}
                        disabled={deletingSlideId === row.id}
                        className="absolute bottom-3 left-3 z-10 rounded-xl bg-red-600/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 disabled:opacity-50 translate-y-2 group-hover:translate-y-0"
                      >
                        {deletingSlideId === row.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB: SETTINGS
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-6">إعدادات الحساب</p>
              <ChangePasswordForm addToast={addToast} />
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB: HOTEL IMAGES
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'hotels' && (
          <div className="space-y-8">

            {/* hotel selector */}
            <section>
              <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4">اختر الفندق</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {HOTEL_DEFINITIONS.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setHotelId(h.id)}
                    className={cn(
                      'relative rounded-2xl border p-5 text-right transition-all duration-200',
                      hotelId === h.id
                        ? 'border-gold/50 bg-gold/8 shadow-[0_0_24px_rgba(212,175,55,0.08)]'
                        : 'border-white/8 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors', hotelId === h.id ? 'bg-gold/20' : 'bg-white/5')}>
                        <Hotel size={16} className={hotelId === h.id ? 'text-gold' : 'text-white/40'} />
                      </div>
                      {hotelId === h.id && (
                        <span className="text-[10px] font-bold text-gold border border-gold/30 rounded-full px-2 py-0.5 bg-gold/5">محدد</span>
                      )}
                    </div>
                    <p className={cn('mt-3 font-bold text-base', hotelId === h.id ? 'text-white' : 'text-white/70')}>{h.displayName}</p>
                    <p className="text-xs text-white/35 mt-1 leading-relaxed line-clamp-2">{h.description}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* category tabs */}
            <section>
              <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4">نوع الغرفة</p>
              <div className="flex flex-wrap gap-2">
                {(selectedHotel?.categories || []).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryKey(c.id)}
                    className={cn(
                      'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 border',
                      categoryKey === c.id
                        ? 'bg-gold text-navy border-gold shadow-[0_0_16px_rgba(212,175,55,0.25)]'
                        : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white/90'
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </section>

            {/* upload zone */}
            <section>
              <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4">رفع صور جديدة</p>
              <UploadZone
                onFiles={onFiles}
                active={uploadActive}
                percent={uploadPercent}
                fileIndex={uploadFileIndex}
                fileCount={uploadFileCount}
              />
            </section>

            {/* image grid */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-medium text-white/40 uppercase tracking-widest">الصور الحالية</p>
                {!loadingList && (
                  <span className="text-xs text-white/30 border border-white/10 rounded-full px-3 py-1">
                    {rows.length} {rows.length === 1 ? 'صورة' : 'صور'}
                  </span>
                )}
              </div>

              {loadingList ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-gold/60" />
                  <p className="text-sm text-white/30">جاري التحميل…</p>
                </div>
              ) : rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl border border-dashed border-white/8">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <ImageIcon size={24} className="text-white/20" />
                  </div>
                  <p className="text-sm text-white/30">لا توجد صور لهذا النوع بعد</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                  {rows.map((row) => (
                    <ImageCard
                      key={row.id}
                      row={row}
                      onDelete={() => onDelete(row)}
                      deleting={actionId === row.id}
                      isHero={heroImageUrl === row.public_url}
                      onSetHero={() => onSetHero(row)}
                      settingHero={settingHeroId === row.id}
                      onPreview={() => setLightboxUrl(row.public_url)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
