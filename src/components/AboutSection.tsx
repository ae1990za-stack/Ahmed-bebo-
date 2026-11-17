import React, { useState } from 'react';
import { Language, SiteConfig } from '../types/portfolio';
import { SectionBackdrop } from './SectionBackdrop';

interface AboutSectionProps {
  config: SiteConfig;
  lang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ config, lang }) => {
  const [skillGroup, setSkillGroup] = useState<'all' | 'dev' | 'design' | 'tools'>('all');

  const filteredSkills = config.skills.filter((s) =>
    skillGroup === 'all' ? true : s.group === skillGroup
  );

  return (
    <section id="about" className="relative overflow-hidden py-16 lg:py-24 bg-white dark:bg-slate-950">
      <SectionBackdrop startIndex={3} intervalMs={4800} intensity="light" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Narrative & Career Timeline */}
          <div className="lg:col-span-5 space-y-6 p-6 sm:p-7 rounded-2xl bg-white/82 dark:bg-slate-900/82 backdrop-blur-md border border-sky-200/70 dark:border-slate-800/80 shadow-sm">
            <div className="space-y-3">
              <p className="font-mono-nums text-xs font-semibold text-sky-700 dark:text-sky-400">
                {lang === 'ar' ? '03. من أنا والمنهجية التقنية' : '03. About & Engineering Approach'}
              </p>
              <h2
                className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                {lang === 'ar' ? config.aboutTitleAr : config.aboutTitleEn}
              </h2>
            </div>

            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {lang === 'ar' ? config.aboutDescAr : config.aboutDescEn}
            </p>

            {/* Career Experience Timeline */}
            <div className="pt-6 border-t border-sky-200/70 dark:border-slate-800 space-y-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'ar' ? 'المسيرة المهنية' : 'Career Timeline'}
              </h3>

              <div className="divide-y divide-sky-200/60 dark:divide-slate-800">
                {config.experiences.map((exp, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {lang === 'ar' ? exp.roleAr : exp.roleEn}
                      </h4>
                      <span className="font-mono-nums text-xs text-sky-600 dark:text-sky-400 font-semibold">
                        {lang === 'ar' ? exp.periodAr : exp.periodEn}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {lang === 'ar' ? exp.companyAr : exp.companyEn}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lang === 'ar' ? exp.summaryAr : exp.summaryEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Technical & Design Skills Matrix */}
          <div className="lg:col-span-7">
            <div
              style={{ borderRadius: 'var(--brand-radius)' }}
              className="p-6 sm:p-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-sky-200/80 dark:border-slate-800 space-y-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sky-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {lang === 'ar' ? 'مصفوفة المهارات التقنية والتصميم' : 'Tech & Design Stack Matrix'}
                  </h3>
                  <p className="font-mono-nums text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {filteredSkills.length} {lang === 'ar' ? 'تخصصات فعّالة' : 'Active Capabilities'}
                  </p>
                </div>

                {/* Segmented Stack Filter */}
                <div className="inline-flex items-center p-1 rounded-xl bg-sky-50 dark:bg-slate-950 border border-sky-200/80 dark:border-slate-800">
                  {[
                    { id: 'all' as const, ar: 'الكل', en: 'All' },
                    { id: 'dev' as const, ar: 'برمجة', en: 'Dev' },
                    { id: 'design' as const, ar: 'تصميم', en: 'Design' },
                    { id: 'tools' as const, ar: 'أدوات', en: 'Tools' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSkillGroup(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        skillGroup === tab.id
                          ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {lang === 'ar' ? tab.ar : tab.en}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredSkills.map((skill, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {lang === 'ar' ? skill.nameAr : skill.nameEn}
                      </span>
                      <span className="font-mono-nums text-xs font-semibold text-sky-600 dark:text-sky-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-sky-50 dark:bg-slate-800 overflow-hidden border border-sky-100 dark:border-slate-700">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(100, Math.max(0, skill.level))}%`,
                          backgroundColor: 'var(--brand-accent)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
