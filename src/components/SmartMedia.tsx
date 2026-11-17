import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Play } from 'lucide-react';
import { resolveMediaUrl } from '../lib/mediaService';

interface SmartMediaProps {
  src?: string;
  videoSrc?: string;
  mediaType?: 'image' | 'video';
  alt: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
}

function getYoutubeEmbed(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function getVimeoEmbed(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

export const SmartMedia: React.FC<SmartMediaProps> = ({
  src,
  videoSrc,
  mediaType = 'image',
  alt,
  className = 'w-full h-full object-cover',
  controls = true,
  autoPlay = false,
}) => {
  const [resolvedImg, setResolvedImg] = useState<string | null>(null);
  const [resolvedVideo, setResolvedVideo] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setImgFailed(false);
    if (!src) {
      setResolvedImg(null);
      return;
    }
    resolveMediaUrl(src).then((res) => {
      if (active) setResolvedImg(res);
    });
    return () => {
      active = false;
    };
  }, [src]);

  useEffect(() => {
    let active = true;
    if (mediaType !== 'video' || !videoSrc) {
      setResolvedVideo(null);
      return;
    }
    resolveMediaUrl(videoSrc).then((res) => {
      if (active) setResolvedVideo(res);
    });
    return () => {
      active = false;
    };
  }, [videoSrc, mediaType]);

  if (mediaType === 'video' && videoSrc && controls) {
    const yt = getYoutubeEmbed(videoSrc);
    if (yt) {
      return (
        <iframe
          src={yt}
          title={alt}
          className={className}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    const vimeo = getVimeoEmbed(videoSrc);
    if (vimeo) {
      return (
        <iframe
          src={vimeo}
          title={alt}
          className={className}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }
    if (resolvedVideo) {
      return (
        <video
          src={resolvedVideo}
          poster={resolvedImg || undefined}
          controls={controls}
          autoPlay={autoPlay}
          playsInline
          className={className}
        />
      );
    }
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-100 dark:from-slate-900 dark:via-slate-950 dark:to-sky-950 text-sky-700 dark:text-sky-300 p-6 text-center">
        <Play className="w-10 h-10 mb-2 opacity-80" />
        <span className="text-xs font-medium">{alt}</span>
      </div>
    );
  }

  if (!resolvedImg || imgFailed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-100 dark:from-slate-900 dark:via-slate-950 dark:to-sky-950 text-sky-700 dark:text-sky-300 p-6 text-center">
        <ImageIcon className="w-8 h-8 mb-2 opacity-60" />
        <span className="text-xs font-medium line-clamp-2 max-w-[200px]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedImg}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setImgFailed(true)}
      className={className}
    />
  );
};
