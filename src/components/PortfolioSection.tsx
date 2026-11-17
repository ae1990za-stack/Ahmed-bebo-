import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Film, Image as ImageIcon, Play, Search, X } from 'lucide-react';
import {
  Language,
  PROJECT_CATEGORIES,
  PortfolioProject,
  ProjectCategory,
} from '../types/portfolio';
import { SectionBackdrop } from './SectionBackdrop';
import { SmartMedia } from './SmartMedia';

interface PortfolioSectionProps {
  projects: PortfolioProject[];
  lang: Language;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ projects, lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProjectCategory>('all');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveProject(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projects.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (mediaFilter !== 'all' && p.mediaType !== mediaFilter) return false;
      if (q) {
        const text = `${p.titleAr} ${p.titleEn} ${p.descriptionAr} ${p.descriptionEn} ${p.client} ${p.tools.join(' ')}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [projects, selectedCategory, mediaFilter, searchQuery]);

  const getCategoryLabel = (catId: ProjectCategory) => {
    const found = PROJECT_CATEGORIES.find((c) => c.id === catId);
    return found ? (lang === 'ar' ? found.labelAr : found.labelEn) : catId;
  };

  const openModal = (project: PortfolioProject) => {
    setActiveProject(project);
    setActiveGalleryIdx(0);
  };

  const activeImages = activeProject
    ? Array.from(new Set([activeProject.coverUrl, ...(activeProject.galleryUrls || [])])).filter(
        Boolean
      )
    : [];

  return (
    <section id="portfolio" className="relative overflow-hidden py-16 lg:py-24 bg-white dark:bg-slate-950">
      <SectionBackdrop startIndex={2} intervalMs={4400} intensity="light" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <p className="font-mono-nums text-xs font-semibold text-sky-700 dark:text-sky-400">
              {lang === 'ar' ? '01. الأعمال والمشاريع التقنية' : '01. Selected Works'}
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {lang === 'ar' ? 'معرض الأعمال والحلول الرقمية' : 'Creative & Engineering Showcase'}
            </h2>
            <p className="text-base text-slate-700 dark:text-slate-300">
              {lang === 'ar'
                ? 'مختارات من تصميمات الشعارات، الهويات البصرية، المتاجر الإلكترونية، المواقع، السير الذاتية، وواجهات التطبيقات.'
                : 'Curated works spanning brand systems, e-commerce platforms, web applications, executive CVs, and mobile UI architecture.'}
            </p>
          </div>

          {/* Search & Media Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث في المشاريع...' : 'Search projects...'}
                className="w-full ps-10 pe-4 py-2.5 rounded-xl text-sm bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div className="inline-flex items-center p-1 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setMediaFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  mediaFilter === 'all'
                    ? 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'الكل' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => setMediaFilter('image')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  mediaFilter === 'image'
                    ? 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'صور' : 'Images'}</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaFilter('video')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  mediaFilter === 'video'
                    ? 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'فيديو' : 'Videos'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Segmented Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-sky-200/70 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            style={selectedCategory === 'all' ? { backgroundColor: 'var(--brand-accent)' } : undefined}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'text-white shadow-sm'
                : 'bg-white/90 dark:bg-slate-900/90 border border-sky-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-300'
            }`}
          >
            {lang === 'ar' ? 'جميع التخصصات' : 'All Works'} ({projects.length})
          </button>

          {PROJECT_CATEGORIES.map((cat) => {
            const count = projects.filter((p) => p.category === cat.id).length;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={active ? { backgroundColor: 'var(--brand-accent)' } : undefined}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'text-white shadow-sm'
                    : 'bg-white/90 dark:bg-slate-900/90 border border-sky-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-300'
                }`}
              >
                {lang === 'ar' ? cat.labelAr : cat.labelEn}{' '}
                <span className="opacity-70 tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Bento Showcase Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-sky-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm">
            <p className="text-base font-medium text-slate-600 dark:text-slate-300">
              {lang === 'ar'
                ? 'لا توجد مشاريع مطابقة لبحثك حاليًا.'
                : 'No projects match your current filter.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setMediaFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-slate-900 border border-sky-200 dark:border-slate-700 hover:bg-sky-100 cursor-pointer"
            >
              {lang === 'ar' ? 'إعادة ضبط الفلتر' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => {
              const isLead = project.featured && index === 0 && selectedCategory === 'all';
              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => openModal(project)}
                  style={{ borderRadius: 'var(--brand-radius)' }}
                  className={`group cursor-pointer overflow-hidden border border-sky-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:border-sky-400 dark:hover:border-sky-600 transition-all duration-200 flex flex-col shadow-sm ${
                    isLead ? 'md:col-span-2' : ''
                  }`}
                >
                  {/* Media Viewport */}
                  <div
                    className={`relative overflow-hidden bg-sky-50 dark:bg-slate-950 ${
                      isLead ? 'aspect-[16/9]' : 'aspect-[4/3]'
                    }`}
                  >
                    <SmartMedia
                      src={project.coverUrl}
                      alt={lang === 'ar' ? project.titleAr : project.titleEn}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />
                    {project.mediaType === 'video' && (
                      <div className="absolute top-3 end-3 w-9 h-9 rounded-full bg-slate-950/75 text-white flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Card Body — Unboxed Technical Metadata */}
                  <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-sky-600 dark:text-sky-400">
                          {getCategoryLabel(project.category)}
                        </span>
                        {project.client && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{project.client}</span>
                          </>
                        )}
                        {project.year && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-nums tabular-nums">{project.year}</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                        {lang === 'ar' ? project.titleAr : project.titleEn}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {lang === 'ar' ? project.descriptionAr : project.descriptionEn}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-sky-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="font-mono-nums truncate max-w-[70%]">
                        {project.tools.slice(0, 3).join(' · ')}
                      </span>
                      <span className="text-sky-600 dark:text-sky-400 font-semibold whitespace-nowrap">
                        {lang === 'ar' ? 'عرض التفاصيل' : 'Inspect'}
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Case Study Modal */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-sky-200 dark:border-slate-800 overflow-hidden shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-sky-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-sky-600 dark:text-sky-400">
                  {getCategoryLabel(activeProject.category)}
                </span>
                {activeProject.client && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{activeProject.client}</span>
                  </>
                )}
                {activeProject.year && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-nums tabular-nums">{activeProject.year}</span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveProject(null)}
                aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
                className="w-9 h-9 rounded-xl border border-sky-100 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-[16/9] w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
              {activeProject.mediaType === 'video' && activeProject.videoUrl && activeGalleryIdx === 0 ? (
                <SmartMedia
                  mediaType="video"
                  src={activeProject.coverUrl}
                  videoSrc={activeProject.videoUrl}
                  alt={lang === 'ar' ? activeProject.titleAr : activeProject.titleEn}
                  className="w-full h-full object-contain bg-black"
                  controls
                />
              ) : (
                <SmartMedia
                  src={activeImages[activeGalleryIdx] || activeProject.coverUrl}
                  alt={lang === 'ar' ? activeProject.titleAr : activeProject.titleEn}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {activeImages.length > 1 && (
              <div className="px-6 pt-4 flex items-center gap-3 overflow-x-auto">
                {activeImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveGalleryIdx(idx)}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                      activeGalleryIdx === idx
                        ? 'border-sky-500 ring-2 ring-sky-200 dark:ring-sky-900'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <SmartMedia src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {lang === 'ar' ? activeProject.titleAr : activeProject.titleEn}
                </h3>
                {activeProject.liveUrl && (
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ backgroundColor: 'var(--brand-accent)' }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shrink-0 hover:opacity-90"
                  >
                    <span>{lang === 'ar' ? 'زيارة المشروع' : 'Live Preview'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'ar' ? activeProject.descriptionAr : activeProject.descriptionEn}
              </p>

              {activeProject.tools.length > 0 && (
                <div className="pt-4 border-t border-sky-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {lang === 'ar' ? 'التقنيات والأدوات:' : 'Tech & Tools:'}
                  </span>
                  <span className="font-mono-nums">{activeProject.tools.join(' · ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
