import React, { useEffect, useState } from 'react';
import { USER_UPLOADED_PHOTOS } from '../data/defaultSeed';
import { LiveCodeStream } from './LiveCodeStream';

interface SectionBackdropProps {
  startIndex?: number;
  intervalMs?: number;
  intensity?: 'light' | 'medium';
}

export const SectionBackdrop: React.FC<SectionBackdropProps> = ({
  startIndex = 0,
  intervalMs = 4200,
  intensity = 'medium',
}) => {
  const [activeIndex, setActiveIndex] = useState(startIndex % USER_UPLOADED_PHOTOS.length);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % USER_UPLOADED_PHOTOS.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Cross-Fading Stack of All 4 Attached Photos Under Content */}
      {USER_UPLOADED_PHOTOS.map((src, idx) => {
        const isActive = idx === activeIndex;
        return (
          <img
            key={`${src}-${idx}`}
            src={src}
            alt=""
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ease-in-out ${
              isActive
                ? intensity === 'medium'
                  ? 'opacity-[0.38] dark:opacity-[0.34]'
                  : 'opacity-[0.28] dark:opacity-[0.26]'
                : 'opacity-0'
            }`}
          />
        );
      })}

      {/* Measured Frosted Light-Blue & White Scrim Under Text (Preserves >= 4.5:1 Contrast) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/62 via-sky-50/50 to-white/68 dark:from-slate-950/72 dark:via-slate-950/60 dark:to-slate-950/78" />

      {/* Technical Blueprint Architectural Grid */}
      <div
        className="absolute inset-0 opacity-65 dark:opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(2, 132, 199, 0.085) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 132, 199, 0.085) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Rapid Typing & Disappearing Code Lines */}
      <LiveCodeStream variant="ambient" />
    </div>
  );
};
