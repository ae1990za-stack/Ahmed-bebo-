import React, { useEffect, useState } from 'react';
import { ExternalLink, MessageCircle, Phone } from 'lucide-react';
import { Language, ServiceItem, SiteConfig } from '../types/portfolio';
import { SectionBackdrop } from './SectionBackdrop';

interface ContactSectionProps {
  config: SiteConfig;
  services: ServiceItem[];
  lang: Language;
  preselectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  config,
  services,
  lang,
  preselectedService,
}) => {
  const [clientName, setClientName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [quickNote, setQuickNote] = useState('');

  useEffect(() => {
    if (preselectedService) {
      setServiceType(preselectedService);
    }
  }, [preselectedService]);

  const whatsappDigits = (config.whatsapp || '201280673759').replace(/[^0-9]/g, '');

  const buildWhatsappUrl = () => {
    const lines = [
      lang === 'ar' ? 'مرحبًا أستاذ أحمد عماد،' : 'Hello Ahmed Emad,',
      clientName ? `${lang === 'ar' ? 'الاسم:' : 'Name:'} ${clientName}` : '',
      serviceType ? `${lang === 'ar' ? 'الخدمة المطلوبة:' : 'Service:'} ${serviceType}` : '',
      quickNote ? `${lang === 'ar' ? 'الرسالة:' : 'Message:'} ${quickNote}` : '',
    ].filter(Boolean);
    const encoded = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${whatsappDigits}?text=${encoded}`;
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-16 lg:py-24 bg-sky-50/40 dark:bg-slate-900/40 border-t border-sky-200/70 dark:border-slate-800/80"
    >
      <SectionBackdrop startIndex={1} intervalMs={4300} intensity="light" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Direct WhatsApp Business & Phone Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <p className="font-mono-nums text-xs font-semibold text-sky-700 dark:text-sky-400">
                {lang === 'ar' ? '04. التواصل المباشر' : '04. Direct Contact'}
              </p>
              <h2
                className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                {lang === 'ar'
                  ? 'تواصل معي مباشرة عبر واتساب الأعمال'
                  : 'Connect directly on WhatsApp Business'}
              </h2>
              <p className="text-base text-slate-700 dark:text-slate-300">
                {lang === 'ar'
                  ? 'التواصل والاتفاق على كافة أعمال التصميم والبرمجة يتم مباشرة وسريعًا عبر حساب واتساب الأعمال الرسمي.'
                  : 'All design and development inquiries are handled directly and promptly via official WhatsApp Business.'}
              </p>
            </div>

            <div className="space-y-3">
              {/* Primary Highlighted WhatsApp Business Card */}
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: 'var(--brand-accent)' }}
                className="flex items-center gap-4 p-5 rounded-xl text-white shadow-md shadow-sky-500/20 hover:opacity-95 transition-opacity"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-sky-100 font-medium">
                    {lang === 'ar' ? 'واتساب الأعمال الرسمي' : 'Official WhatsApp Business'}
                  </p>
                  <p className="text-lg font-bold font-mono-nums mt-0.5" dir="ltr">
                    {config.phone || '01280673759'}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-sky-100 shrink-0" />
              </a>

              <a
                href={`tel:${(config.phone || '01280673759').replace(/\s+/g, '')}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-sky-200/80 dark:border-slate-800 hover:border-sky-400 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'ar' ? 'اتصال هاتفي مباشر' : 'Direct Phone'}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white font-mono-nums" dir="ltr">
                    {config.phone || '01280673759'}
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* WhatsApp Business Direct Chat Launcher */}
          <div className="lg:col-span-7">
            <div
              style={{ borderRadius: 'var(--brand-radius)' }}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-sky-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-sm"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {lang === 'ar'
                    ? 'بدء محادثة واتساب الأعمال'
                    : 'Start WhatsApp Business Chat'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {lang === 'ar'
                    ? 'اختر الخدمة واكتب رسالتك القصيرة ليتم فتح المحادثة مباشرة في واتساب الأعمال.'
                    : 'Choose a service and add a short note to open a direct chat in WhatsApp Business.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {lang === 'ar' ? 'اسمك (اختياري)' : 'Your Name (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: كريم منصور' : 'e.g. Karim Mansour'}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-sky-50/40 dark:bg-slate-950 border border-sky-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {lang === 'ar' ? 'الخدمة المطلوبة' : 'Requested Service'}
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-sky-50/40 dark:bg-slate-950 border border-sky-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="">
                      {lang === 'ar' ? 'اختر نوع الخدمة...' : 'Select a service...'}
                    </option>
                    {services.map((srv) => {
                      const lbl = lang === 'ar' ? srv.titleAr : srv.titleEn;
                      return (
                        <option key={srv.id} value={lbl}>
                          {lbl}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'ar' ? 'رسالتك (اختياري)' : 'Quick Message (Optional)'}
                </label>
                <textarea
                  rows={3}
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'اكتب نبذة مختصرة عن المطلوب للمناقشة عبر واتساب الأعمال...'
                      : 'Write a short note to discuss on WhatsApp Business...'
                  }
                  className="w-full px-4 py-3 rounded-xl text-sm bg-sky-50/40 dark:bg-slate-950 border border-sky-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 resize-y"
                />
              </div>

              <a
                href={buildWhatsappUrl()}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: 'var(--brand-accent)' }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:opacity-95 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>
                  {lang === 'ar'
                    ? 'مراسلة عبر واتساب الأعمال (01280673759)'
                    : 'Chat on WhatsApp Business (01280673759)'}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
