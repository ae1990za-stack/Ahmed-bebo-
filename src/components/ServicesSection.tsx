import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  Check,
  FileText,
  Globe,
  Layers,
  Palette,
  PenTool,
  ShoppingBag,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { Language, ServiceItem } from '../types/portfolio';
import { SectionBackdrop } from './SectionBackdrop';

interface ServicesSectionProps {
  services: ServiceItem[];
  lang: Language;
  onRequestService: (serviceTitle: string) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  PenTool,
  Layers,
  ShoppingBag,
  Globe,
  FileText,
  Sparkles,
  Smartphone,
  Palette,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  lang,
  onRequestService,
}) => {
  const ArrowIcon = lang === 'ar' ? ArrowUpLeft : ArrowUpRight;

  return (
    <section
      id="services"
      className="relative overflow-hidden py-16 lg:py-24 bg-sky-50/40 dark:bg-slate-900/40 border-y border-sky-200/70 dark:border-slate-800/80"
    >
      <SectionBackdrop startIndex={0} intervalMs={4600} intensity="light" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-3 mb-12">
          <p className="font-mono-nums text-xs font-semibold text-sky-700 dark:text-sky-400">
            {lang === 'ar' ? '02. الخدمات والحلول التقنية' : '02. Studio Services'}
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            {lang === 'ar'
              ? 'حلول تصميم وهندسة واجهات متكاملة'
              : 'End-to-End Design & Frontend Craft'}
          </h2>
          <p className="text-base text-slate-700 dark:text-slate-300">
            {lang === 'ar'
              ? 'خدمات مخصصة للشركات الناشئة، المتاجر الإلكترونية، والأفراد بأعلى معايير الدقة والأداء.'
              : 'Tailored visual and digital product services engineered for founders, brands, and modern teams.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, idx) => {
            const IconComp = ICON_MAP[service.iconName] || Layers;
            const title = lang === 'ar' ? service.titleAr : service.titleEn;
            const deliverables = lang === 'ar' ? service.deliverablesAr : service.deliverablesEn;
            const num = String(idx + 1).padStart(2, '0');

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.2) }}
                style={{ borderRadius: 'var(--brand-radius)' }}
                className="group bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-sky-200/80 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 p-7 flex flex-col justify-between transition-all duration-200 shadow-sm"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200/70 dark:border-sky-900">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="font-mono-nums text-xs font-semibold text-sky-600/80 dark:text-sky-400/80">
                      {num}.
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lang === 'ar' ? service.descriptionAr : service.descriptionEn}
                    </p>
                  </div>

                  {deliverables && deliverables.length > 0 && (
                    <ul className="space-y-2 pt-3 border-t border-sky-100 dark:border-slate-800/80">
                      {deliverables.map((item, dIdx) => (
                        <li
                          key={dIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300"
                        >
                          <Check className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-sky-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono-nums tabular-nums">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {service.priceRange || (lang === 'ar' ? 'حسب المشروع' : 'Custom Quote')}
                    </span>
                    {(service.deliveryTimeAr || service.deliveryTimeEn) && (
                      <>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span>{lang === 'ar' ? service.deliveryTimeAr : service.deliveryTimeEn}</span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onRequestService(title)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{lang === 'ar' ? 'اطلب الخدمة' : 'Inquire'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
