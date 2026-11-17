import React, { useState } from 'react';
import { Menu, MessageCircle, X } from 'lucide-react';
import { Language, SiteConfig, ThemeMode } from '../types/portfolio';

interface NavbarProps {
  config: SiteConfig;
  lang: Language;
  mode: ThemeMode;
  onToggleLang: () => void;
  onToggleMode: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  lang,
  mode,
  onToggleLang,
  onToggleMode,
  onNavigateSection,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'hero', ar: 'الرئيسية', en: 'Home' },
    { id: 'portfolio', ar: 'أعمالي', en: 'Portfolio' },
    { id: 'services', ar: 'الخدمات', en: 'Services' },
    { id: 'about', ar: 'من أنا', en: 'About' },
    { id: 'contact', ar: 'تواصل معي', en: 'Contact' },
  ];

  const handleNav = (id: string) => {
    setMobileOpen(false);
    onNavigateSection(id);
  };

  const whatsappDigits = (config.whatsapp || '201280673759').replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-sky-200/70 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNav('hero');
          }}
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          {lang === 'ar' ? config.nameAr : config.nameEn}
        </a>

        {/* Zone 2: 5 Concise Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNav(item.id);
              }}
              className="relative py-1 whitespace-nowrap shrink-0 hover:text-sky-600 dark:hover:text-sky-400 transition-colors after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-sky-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
            >
              {lang === 'ar' ? item.ar : item.en}
            </a>
          ))}
        </nav>

        {/* Zone 3: Direct WhatsApp Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`https://wa.me/${whatsappDigits}`}
            target="_blank"
            rel="noreferrer"
            style={{ backgroundColor: 'var(--brand-accent)' }}
            className="hidden md:inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all duration-200 whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{lang === 'ar' ? 'واتساب الأعمال' : 'WhatsApp Business'}</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={lang === 'ar' ? 'القائمة' : 'Menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-sky-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-900 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.id);
                }}
                className="px-3 py-3 rounded-xl text-base font-medium text-slate-800 dark:text-slate-100 hover:bg-sky-50 dark:hover:bg-slate-900 transition-colors"
              >
                {lang === 'ar' ? item.ar : item.en}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-sky-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <a
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noreferrer"
              style={{ backgroundColor: 'var(--brand-accent)' }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'واتساب: 01280673759' : 'WhatsApp'}</span>
            </a>
            <button
              type="button"
              onClick={onToggleLang}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-sky-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            <button
              type="button"
              onClick={onToggleMode}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-sky-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              {mode === 'light'
                ? lang === 'ar'
                  ? 'ليلي'
                  : 'Dark'
                : lang === 'ar'
                ? 'نهاري'
                : 'Light'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
