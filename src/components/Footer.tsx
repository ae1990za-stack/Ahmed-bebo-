import React from 'react';
import { Globe, MessageCircle, Moon, Sun } from 'lucide-react';
import { Language, SiteConfig, ThemeMode } from '../types/portfolio';

interface FooterProps {
  config: SiteConfig;
  lang: Language;
  mode: ThemeMode;
  onToggleLang: () => void;
  onToggleMode: () => void;
  onNavigateSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  lang,
  mode,
  onToggleLang,
  onToggleMode,
  onNavigateSection,
}) => {
  const year = new Date().getFullYear();
  const whatsappDigits = (config.whatsapp || '201280673759').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-sky-200/70 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
            {lang === 'ar' ? config.nameAr : config.nameEn}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © <span className="tabular-nums">{year}</span>{' '}
            {lang === 'ar'
              ? 'جميع الحقوق محفوظة — استوديو التصميم والهندسة الرقمية.'
              : 'All rights reserved — Design & Frontend Engineering Studio.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
          {[
            { id: 'hero', ar: 'الرئيسية', en: 'Home' },
            { id: 'portfolio', ar: 'الأعمال', en: 'Portfolio' },
            { id: 'services', ar: 'الخدمات', en: 'Services' },
            { id: 'about', ar: 'من أنا', en: 'About' },
            { id: 'contact', ar: 'تواصل معي', en: 'Contact' },
          ].map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onNavigateSection(link.id)}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
            >
              {lang === 'ar' ? link.ar : link.en}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`https://wa.me/${whatsappDigits}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="font-mono-nums" dir="ltr">{config.phone}</span>
          </a>

          <button
            type="button"
            onClick={onToggleLang}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-sky-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-900 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleMode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-sky-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-900 cursor-pointer"
          >
            {mode === 'light' ? (
              <Moon className="w-3.5 h-3.5 text-sky-600" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-sky-400" />
            )}
            <span>{mode === 'light' ? (lang === 'ar' ? 'ليلي' : 'Dark') : lang === 'ar' ? 'نهاري' : 'Light'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
