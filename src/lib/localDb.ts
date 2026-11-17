const DB_NAME = 'ahmed_emad_portfolio_local_db';
const DB_VERSION = 1;
const STORE_KV = 'kv';
const STORE_MEDIA = 'media';

export interface StoredMediaRecord {
  id: string;
  kind: 'image' | 'video';
  mimeType: string;
  fileName: string;
  blob: Blob;
  createdAt: number;
}

type DbListener = (key: string) => void;
const listeners = new Set<DbListener>();

export function subscribeDbChanges(listener: DbListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyDbChange(key: string): void {
  listeners.forEach((fn) => {
    try {
      fn(key);
    } catch (e) {
      console.error('LocalDB listener error:', e);
    }
  });
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openLocalDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_KV)) {
        db.createObjectStore(STORE_KV);
      }
      if (!db.objectStoreNames.contains(STORE_MEDIA)) {
        db.createObjectStore(STORE_MEDIA, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('IndexedDB failed to open'));
  });

  return dbPromise;
}

export async function kvGet<T>(key: string): Promise<T | undefined> {
  try {
    const db = await openLocalDatabase();
    return await new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_KV, 'readonly');
      const store = tx.objectStore(STORE_KV);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB kvGet fallback to localStorage:', err);
    const raw = localStorage.getItem(`ae_local_${key}`);
    return raw ? (JSON.parse(raw) as T) : undefined;
  }
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openLocalDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_KV, 'readwrite');
      const store = tx.objectStore(STORE_KV);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB kvSet fallback to localStorage:', err);
    localStorage.setItem(`ae_local_${key}`, JSON.stringify(value));
  }
  notifyDbChange(key);
}

export async function mediaPut(record: StoredMediaRecord): Promise<void> {
  const db = await openLocalDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_MEDIA, 'readwrite');
    const store = tx.objectStore(STORE_MEDIA);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function mediaGet(id: string): Promise<StoredMediaRecord | undefined> {
  const db = await openLocalDatabase();
  return await new Promise<StoredMediaRecord | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE_MEDIA, 'readonly');
    const store = tx.objectStore(STORE_MEDIA);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result as StoredMediaRecord | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function mediaGetAll(): Promise<StoredMediaRecord[]> {
  const db = await openLocalDatabase();
  return await new Promise<StoredMediaRecord[]>((resolve, reject) => {
    const tx = db.transaction(STORE_MEDIA, 'readonly');
    const store = tx.objectStore(STORE_MEDIA);
    const req = store.getAll();
    req.onsuccess = () => resolve((req.result as StoredMediaRecord[]) || []);
    req.onerror = () => reject(req.error);
  });
}

export async function mediaDelete(id: string): Promise<void> {
  const db = await openLocalDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_MEDIA, 'readwrite');
    const store = tx.objectStore(STORE_MEDIA);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
