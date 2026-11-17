import React, { useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { PortfolioSection } from './components/PortfolioSection';
import { ServicesSection } from './components/ServicesSection';
import { DEFAULT_PROJECTS, DEFAULT_SERVICES, DEFAULT_SITE_CONFIG } from './data/defaultSeed';
import { subscribePublicPortfolio } from './lib/portfolioService';
import {
  Language,
  PortfolioProject,
  ServiceItem,
  SiteConfig,
  ThemeMode,
} from './types/portfolio';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('ae_lang');
    return saved === 'en' ? 'en' : 'ar';
  });

  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ae_mode');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [projects, setProjects] = useState<PortfolioProject[]>(DEFAULT_PROJECTS);
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [preselectedService, setPreselectedService] = useState<string>('');

  useEffect(() => {
    const unsub = subscribePublicPortfolio(
      () => {
        // Keep updated config merged with latest WhatsApp/contact defaults if previously seeded
        setConfig(DEFAULT_SITE_CONFIG);
      },
      (projs) => setProjects(projs),
      (srvs) => setServices(srvs)
    );
    return unsub;
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('ae_lang', lang);
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('ae_mode', mode);
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    const theme = config.theme;
    if (theme) {
      root.style.setProperty('--brand-accent', theme.accentHex || '#0284c7');
      root.style.setProperty('--brand-accent-soft', theme.accentSoftHex || '#e0f2fe');
      root.style.setProperty('--brand-surface-tint', theme.surfaceTintHex || '#f4f9ff');
      root.style.setProperty('--brand-radius', '16px');
    }
  }, [config.theme]);

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRequestService = (serviceTitle: string) => {
    setPreselectedService(serviceTitle);
    handleNavigateSection('contact');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Navbar
          config={config}
          lang={lang}
          mode={mode}
          onToggleLang={() => setLang((p) => (p === 'ar' ? 'en' : 'ar'))}
          onToggleMode={() => setMode((p) => (p === 'light' ? 'dark' : 'light'))}
          onNavigateSection={handleNavigateSection}
        />

        <main className="flex-1">
          <HeroSection
            config={config}
            lang={lang}
            mode={mode}
            onToggleLang={() => setLang((p) => (p === 'ar' ? 'en' : 'ar'))}
            onToggleMode={() => setMode((p) => (p === 'light' ? 'dark' : 'light'))}
            onViewPortfolio={() => handleNavigateSection('portfolio')}
            onContactMe={() => handleNavigateSection('contact')}
          />

          <PortfolioSection projects={projects} lang={lang} />

          <ServicesSection
            services={services}
            lang={lang}
            onRequestService={handleRequestService}
          />

          <AboutSection config={config} lang={lang} />

          <ContactSection
            config={config}
            services={services}
            lang={lang}
            preselectedService={preselectedService}
          />
        </main>

        <Footer
          config={config}
          lang={lang}
          mode={mode}
          onToggleLang={() => setLang((p) => (p === 'ar' ? 'en' : 'ar'))}
          onToggleMode={() => setMode((p) => (p === 'light' ? 'dark' : 'light'))}
          onNavigateSection={handleNavigateSection}
        />
      </div>
    </ErrorBoundary>
  );
}
