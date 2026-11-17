import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowDownLeft,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  Globe,
  MessageCircle,
  Moon,
  Sun,
  Terminal,
} from 'lucide-react';
import { USER_UPLOADED_PHOTOS } from '../data/defaultSeed';
import { Language, SiteConfig, ThemeMode } from '../types/portfolio';
import { LiveCodeStream } from './LiveCodeStream';
import { SectionBackdrop } from './SectionBackdrop';

interface HeroSectionProps {
  config: SiteConfig;
  lang: Language;
  mode: ThemeMode;
  onToggleLang: () => void;
  onToggleMode: () => void;
  onViewPortfolio: () => void;
  onContactMe: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  lang,
  mode,
  onToggleLang,
  onToggleMode,
  onViewPortfolio,
  onContactMe,
}) => {
  const titles = lang === 'ar' ? config.titlesAr : config.titlesEn;
  const [titleIdx, setTitleIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    if (!titles || titles.length <= 1) return;
    const timer = setInterval(() => {
      setTitleIdx((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [titles]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      setPhotoIdx((prev) => (prev + 1) % USER_UPLOADED_PHOTOS.length);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  const activeTitle = titles[titleIdx % Math.max(1, titles.length)] || '';
  const ArrowIcon = lang === 'ar' ? ArrowDownLeft : ArrowDownRight;
  const whatsappDigits = (config.whatsapp || '201280673759').replace(/[^0-9]/g, '');

  const marqueeWords =
    lang === 'ar'
      ? [
          'تصميم الشعارات',
          'الهويات البصرية',
          'المتاجر الإلكترونية',
          'تطوير المواقع React & TS',
          'السير الذاتية ATS',
          'تصميم الجرافيك والإعلانات',
          'واجهات التطبيقات UI/UX',
        ]
      : [
          'Logo Engineering',
          'Brand Identity Systems',
          'E-Commerce Storefronts',
          'Frontend React & TypeScript',
          'ATS Executive CV Design',
          'Graphic & Ad Visuals',
          'Mobile App UI/UX',
        ];

  return (
    <section id="hero" className="relative overflow-hidden bg-white dark:bg-slate-950">
      <SectionBackdrop startIndex={1} intervalMs={4000} intensity="medium" />

      {/* Technical Utility Strip */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3 flex flex-wrap items-center justify-between gap-4 border-b border-sky-200/70 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
          <Terminal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span className="font-mono-nums">
            {lang === 'ar'
              ? 'استوديو التصميم والهندسة الرقمية'
              : 'Design & Frontend Engineering Studio'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLang}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 hover:border-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleMode}
            aria-label={lang === 'ar' ? 'تبديل المظهر' : 'Toggle theme'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 hover:border-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {mode === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-600" />
                <span>{lang === 'ar' ? 'ليلي' : 'Dark'}</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-sky-400" />
                <span>{lang === 'ar' ? 'نهاري' : 'Light'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Redesigned Architectural Bento Hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:pt-12 lg:pb-16 space-y-8">
        {/* Top Command Headline Band */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
        >
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-300">
              <Code2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>{activeTitle}</span>
              <span aria-hidden="true" className="text-sky-300 dark:text-sky-700">·</span>
              <span className="font-mono-nums text-xs text-slate-600 dark:text-slate-400">
                UI/UX · React · Brand Systems
              </span>
            </div>

            <h1
              className="font-display font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]"
              style={{ fontSize: 'clamp(2.75rem, 5.5vw, 4.75rem)', textWrap: 'balance' }}
            >
              {lang === 'ar' ? config.nameAr : config.nameEn}
            </h1>

            <p
              className="text-lg sm:text-2xl font-semibold text-sky-900 dark:text-sky-200 leading-snug max-w-3xl"
              style={{ textWrap: 'balance' }}
            >
              {lang === 'ar' ? config.taglineAr : config.taglineEn}
            </p>
          </div>

          {/* Right Live Code Console */}
          <div className="lg:col-span-4">
            <LiveCodeStream variant="spotlight" />
          </div>
        </motion.div>

        {/* Second Row: Architectural Split — Rotating Portrait Gallery + Technical Studio Control Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Rotating Portrait Showcase (Cycles Smoothly Through All 4 Attached Photos) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="lg:col-span-5 flex"
          >
            <div className="relative w-full min-h-[400px] sm:min-h-[460px] lg:h-full rounded-2xl overflow-hidden border border-sky-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg shadow-sky-900/5">
              {/* Architectural Corner Reticles */}
              <span className="pointer-events-none absolute top-2.5 start-2.5 z-20 w-3 h-3 border-t-2 border-s-2 border-sky-400/90" />
              <span className="pointer-events-none absolute top-2.5 end-2.5 z-20 w-3 h-3 border-t-2 border-e-2 border-sky-400/90" />
              <span className="pointer-events-none absolute bottom-2.5 start-2.5 z-20 w-3 h-3 border-b-2 border-s-2 border-sky-400/90" />
              <span className="pointer-events-none absolute bottom-2.5 end-2.5 z-20 w-3 h-3 border-b-2 border-e-2 border-sky-400/90" />

              {USER_UPLOADED_PHOTOS.map((src, idx) => (
                <img
                  key={`${src}-${idx}`}
                  src={src}
                  alt={lang === 'ar' ? config.nameAr : config.nameEn}
                  referrerPolicy="no-referrer"
                  className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ease-in-out ${
                    idx === photoIdx ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

              <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between text-white">
                <div>
                  <p className="font-mono-nums text-xs text-sky-300 font-semibold">
                    0{photoIdx + 1} / 0{USER_UPLOADED_PHOTOS.length}
                  </p>
                  <p className="text-sm font-bold">{lang === 'ar' ? config.nameAr : config.nameEn}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() =>
                      setPhotoIdx(
                        (prev) => (prev - 1 + USER_UPLOADED_PHOTOS.length) % USER_UPLOADED_PHOTOS.length
                      )
                    }
                    className="w-8 h-8 rounded-lg bg-slate-950/60 hover:bg-sky-600/80 border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() => setPhotoIdx((prev) => (prev + 1) % USER_UPLOADED_PHOTOS.length)}
                    className="w-8 h-8 rounded-lg bg-slate-950/60 hover:bg-sky-600/80 border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technical Overview, Stack Matrix & Action Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-white/88 dark:bg-slate-900/88 backdrop-blur-md border border-sky-200/90 dark:border-slate-800 shadow-sm"
          >
            <div className="space-y-5">
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                {lang === 'ar' ? config.bioAr : config.bioEn}
              </p>

              {/* Technical Capabilities Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-slate-950/70 border border-sky-100 dark:border-slate-800 space-y-1">
                  <Cpu className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {lang === 'ar' ? 'تطوير الواجهات' : 'Frontend Stack'}
                  </p>
                  <p className="font-mono-nums text-[11px] text-slate-500 dark:text-slate-400">
                    React · TypeScript · Tailwind
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-slate-950/70 border border-sky-100 dark:border-slate-800 space-y-1">
                  <Code2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {lang === 'ar' ? 'تجربة المستخدم UI/UX' : 'UI/UX Architecture'}
                  </p>
                  <p className="font-mono-nums text-[11px] text-slate-500 dark:text-slate-400">
                    Figma · Design Systems
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-slate-950/70 border border-sky-100 dark:border-slate-800 space-y-1">
                  <Terminal className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {lang === 'ar' ? 'الهوية والجرافيك' : 'Brand & Print'}
                  </p>
                  <p className="font-mono-nums text-[11px] text-slate-500 dark:text-slate-400">
                    Logos · Visual Identity · ATS CV
                  </p>
                </div>
              </div>

              {/* 4-Column Tabular Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-sky-100 dark:border-slate-800">
                <div>
                  <div className="font-display font-bold text-2xl sm:text-3xl text-sky-600 dark:text-sky-400 tabular-nums">
                    +{config.yearsExperience}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'ar' ? 'سنوات الخبرة' : 'Years Exp.'}
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tabular-nums">
                    +{config.projectsCompleted}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'ar' ? 'مشروعًا مكتملًا' : 'Projects'}
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tabular-nums">
                    +{config.clientsServed}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'ar' ? 'عميلًا وعلامة' : 'Clients'}
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-2xl sm:text-3xl text-sky-600 dark:text-sky-400 tabular-nums">
                    6
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'ar' ? 'تخصصات متكاملة' : 'Disciplines'}
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="pt-4 border-t border-sky-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onViewPortfolio}
                style={{ backgroundColor: 'var(--brand-accent)' }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:opacity-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{lang === 'ar' ? 'مشاهدة أعمالي' : 'View My Work'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-sky-800 dark:text-sky-200 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>
                  {lang === 'ar' ? 'واتساب الأعمال: 01280673759' : 'WhatsApp Business: 01280673759'}
                </span>
              </a>

              <button
                type="button"
                onClick={onContactMe}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 hover:border-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{lang === 'ar' ? 'تواصل معي' : 'Contact'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Editorial Marquee Ribbon */}
      <div className="relative z-10 border-y border-sky-200/80 dark:border-slate-800/80 bg-sky-50/85 dark:bg-slate-900/75 backdrop-blur-sm py-3.5 overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 text-sm font-medium text-sky-800 dark:text-sky-200">
          {[...marqueeWords, ...marqueeWords].map((word, idx) => (
            <div key={idx} className="flex items-center gap-8 whitespace-nowrap">
              <span>{word}</span>
              <span aria-hidden="true" className="text-sky-400 dark:text-sky-700">·</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
