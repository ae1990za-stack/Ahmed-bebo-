import { mediaGet, mediaPut } from './localDb';

const objectUrlCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string | null>>();

function makeMediaId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${rand}`.replace(/[^a-zA-Z0-9_-]/g, '');
}

export function isMediaRef(url?: string): boolean {
  return Boolean(url && url.startsWith('media:'));
}

export function extractMediaId(url: string): string {
  return url.replace(/^media:/, '').trim();
}

async function optimizeImageBlob(file: File): Promise<{ blob: Blob; mimeType: string }> {
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Invalid image'));
      image.src = dataUrl;
    });

    const maxDim = 1800;
    let { width, height } = img;
    if (width > maxDim || height > maxDim) {
      const ratio = Math.min(maxDim / width, maxDim / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { blob: file, mimeType: file.type || 'image/jpeg' };

    ctx.drawImage(img, 0, 0, width, height);
    const outBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/webp', 0.9)
    );
    if (outBlob) {
      return { blob: outBlob, mimeType: 'image/webp' };
    }
    return { blob: file, mimeType: file.type || 'image/jpeg' };
  } catch {
    return { blob: file, mimeType: file.type || 'image/jpeg' };
  }
}

export async function uploadImageAsset(file: File): Promise<string> {
  const { blob, mimeType } = await optimizeImageBlob(file);
  const mediaId = makeMediaId('img');
  await mediaPut({
    id: mediaId,
    kind: 'image',
    mimeType,
    fileName: (file.name || 'image.webp').slice(0, 180),
    blob,
    createdAt: Date.now(),
  });
  const url = URL.createObjectURL(blob);
  objectUrlCache.set(mediaId, url);
  return `media:${mediaId}`;
}

export async function uploadVideoAsset(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const mediaId = makeMediaId('vid');
  if (onProgress) onProgress(35);
  await mediaPut({
    id: mediaId,
    kind: 'video',
    mimeType: file.type || 'video/mp4',
    fileName: (file.name || 'video.mp4').slice(0, 180),
    blob: file,
    createdAt: Date.now(),
  });
  if (onProgress) onProgress(100);
  const url = URL.createObjectURL(file);
  objectUrlCache.set(mediaId, url);
  return `media:${mediaId}`;
}

export async function resolveMediaUrl(url?: string): Promise<string | null> {
  if (!url) return null;
  if (!isMediaRef(url)) return url;

  const mediaId = extractMediaId(url);
  if (objectUrlCache.has(mediaId)) {
    return objectUrlCache.get(mediaId)!;
  }

  if (pendingRequests.has(mediaId)) {
    return pendingRequests.get(mediaId)!;
  }

  const promise = (async () => {
    try {
      const record = await mediaGet(mediaId);
      if (!record || !record.blob) return null;
      const objUrl = URL.createObjectURL(record.blob);
      objectUrlCache.set(mediaId, objUrl);
      return objUrl;
    } catch (error) {
      console.error('Failed to resolve local media:', error);
      return null;
    } finally {
      pendingRequests.delete(mediaId);
    }
  })();

  pendingRequests.set(mediaId, promise);
  return promise;
}
