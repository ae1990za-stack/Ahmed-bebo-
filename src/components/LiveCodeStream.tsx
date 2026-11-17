import React, { useEffect, useState } from 'react';

const CODE_SNIPPETS = [
  "const identity = createBrandSystem({ palette: ['#0284C7', '#FFFFFF'], grid: '8px' });",
  'export const Storefront = () => <CheckoutFlow currency="EGP" instant />;',
  'interface UIArchitecture { responsive: true; rtl: true; theme: "sky-white"; }',
  'await animateLayer({ transform: "translateY(0)", opacity: 1, duration: 180 });',
  'function craftLogo(ratio: number) { return svgPath.scale(ratio * 1.618); }',
  'const appScreens = buildMobileKit({ ios: true, android: true, tokens: skyBlue });',
  'export type CreativeStack = "Graphic" | "Branding" | "React" | "TypeScript" | "UI/UX";',
  'const resumeATS = compileGrid({ columns: 12, font: "IBM Plex", clean: true });',
];

interface TypingLaneProps {
  snippets: string[];
  startOffset: number;
  speedMs?: number;
  className?: string;
}

const TypingLane: React.FC<TypingLaneProps> = ({
  snippets,
  startOffset,
  speedMs = 16,
  className = '',
}) => {
  const [snippetIdx, setSnippetIdx] = useState(startOffset % snippets.length);
  const [charCount, setCharCount] = useState(0);
  const [fading, setFading] = useState(false);

  const currentText = snippets[snippetIdx];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCharCount(currentText.length);
      return;
    }

    if (fading) {
      const fadeTimer = setTimeout(() => {
        setFading(false);
        setCharCount(0);
        setSnippetIdx((prev) => (prev + 1) % snippets.length);
      }, 320);
      return () => clearTimeout(fadeTimer);
    }

    if (charCount < currentText.length) {
      const typeTimer = setTimeout(() => {
        setCharCount((c) => c + 1);
      }, speedMs);
      return () => clearTimeout(typeTimer);
    }

    const holdTimer = setTimeout(() => {
      setFading(true);
    }, 650);
    return () => clearTimeout(holdTimer);
  }, [charCount, currentText, fading, snippets.length, speedMs]);

  return (
    <div
      dir="ltr"
      className={`font-mono-nums transition-opacity duration-300 ${
        fading ? 'opacity-0' : 'opacity-100'
      } ${className}`}
    >
      <span>{currentText.slice(0, charCount)}</span>
      <span className="inline-block w-1.5 h-[1em] bg-sky-500/90 dark:bg-sky-400/90 align-middle ms-0.5 animate-pulse" />
    </div>
  );
};

interface LiveCodeStreamProps {
  variant?: 'ambient' | 'spotlight';
}

export const LiveCodeStream: React.FC<LiveCodeStreamProps> = ({ variant = 'ambient' }) => {
  if (variant === 'spotlight') {
    return (
      <div
        dir="ltr"
        className="relative w-full rounded-xl bg-slate-900/95 dark:bg-slate-900 border border-sky-400/40 dark:border-sky-800/80 px-4 py-3.5 text-left shadow-md shadow-sky-900/10 overflow-hidden"
      >
        <div className="flex items-center justify-between text-[11px] font-mono-nums text-sky-300/85 mb-2 pb-1.5 border-b border-sky-500/20">
          <span>ahmed-emad.studio.tsx</span>
          <span className="text-sky-400">TSX · UI/UX</span>
        </div>
        <div className="space-y-1.5">
          <TypingLane
            snippets={CODE_SNIPPETS}
            startOffset={0}
            speedMs={14}
            className="text-xs sm:text-sm text-sky-100 min-h-[1.35rem] truncate"
          />
          <TypingLane
            snippets={CODE_SNIPPETS}
            startOffset={3}
            speedMs={17}
            className="text-xs text-sky-300/90 min-h-[1.25rem] truncate"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none flex flex-col justify-between p-6 sm:p-10 opacity-85"
    >
      <TypingLane
        snippets={CODE_SNIPPETS}
        startOffset={1}
        speedMs={15}
        className="text-[11px] sm:text-xs text-sky-800/55 dark:text-sky-300/40 max-w-xl truncate"
      />
      <TypingLane
        snippets={CODE_SNIPPETS}
        startOffset={4}
        speedMs={13}
        className="text-[11px] sm:text-xs text-sky-900/50 dark:text-sky-400/35 self-end max-w-xl truncate"
      />
      <TypingLane
        snippets={CODE_SNIPPETS}
        startOffset={6}
        speedMs={17}
        className="text-[11px] sm:text-xs text-sky-800/50 dark:text-sky-300/35 max-w-lg truncate hidden sm:block"
      />
    </div>
  );
};
