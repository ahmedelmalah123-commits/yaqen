/**
 * Yaqeen Offline Quran Audio Manager
 * Uses browser CacheStorage ('yaqeen-audio-offline-v1') and IndexedDB ('yaqeen_offline_db')
 * to provide genuine offline audio playback, storage quota calculation, and download progress tracking.
 */

export interface OfflineSurahRecord {
  id: string; // `${reciterId}_${surahNumber}`
  surahNumber: number;
  surahName: string;
  reciterId: string;
  reciterName: string;
  streamUrl: string;
  fileSizeBytes: number;
  downloadedAt: string;
  mimeType: string;
}

const CACHE_NAME = 'yaqeen-audio-offline-v1';
const DB_NAME = 'yaqeen_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'surah_downloads';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported on this platform.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB.'));
  });
}

function makeSurahKey(reciterId: string, surahNumber: number): string {
  return `${reciterId}_${surahNumber}`;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 ميغابايت';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} غيغابايت`;
  }
  return `${mb.toFixed(1)} ميغابايت`;
}

/**
 * Check if a specific surah is already saved offline for a reciter.
 */
export async function isSurahAudioDownloaded(
  reciterId: string,
  surahNumber: number
): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(makeSurahKey(reciterId, surahNumber));
      req.onsuccess = () => resolve(Boolean(req.result));
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Returns a playable URL for an offline surah if cached in CacheStorage,
 * or null if not available offline.
 */
export async function getOfflineAudioUrl(
  reciterId: string,
  surahNumber: number
): Promise<string | null> {
  try {
    const isSaved = await isSurahAudioDownloaded(reciterId, surahNumber);
    if (!isSaved) return null;

    if (!('caches' in window)) return null;
    const cache = await caches.open(CACHE_NAME);
    const key = makeSurahKey(reciterId, surahNumber);
    const cachedResponse = await cache.match(`/offline-audio/${key}.mp3`);
    if (!cachedResponse) return null;

    const blob = await cachedResponse.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

/**
 * Download a surah audio stream with progress reporting.
 */
export async function downloadSurahAudio(params: {
  surahNumber: number;
  surahName: string;
  reciterId: string;
  reciterName: string;
  streamUrl: string;
  onProgress?: (progressPercent: number, receivedBytes: number, totalBytes: number) => void;
}): Promise<OfflineSurahRecord> {
  const { surahNumber, surahName, reciterId, reciterName, streamUrl, onProgress } = params;

  if (!('caches' in window)) {
    throw new Error('ميزة التخزين بدون إنترنت (Cache API) غير مدعومة في هذا المتصفح.');
  }

  const response = await fetch(streamUrl, { mode: 'cors' });
  if (!response.ok) {
    throw new Error(`تعذر تنزيل الملف الصوتي (رمز الاستجابة: ${response.status})`);
  }

  const contentLengthHeader = response.headers.get('content-length');
  const totalBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;

  const reader = response.body ? response.body.getReader() : null;
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        receivedBytes += value.length;
        if (totalBytes > 0 && onProgress) {
          const percent = Math.min(100, Math.round((receivedBytes / totalBytes) * 100));
          onProgress(percent, receivedBytes, totalBytes);
        }
      }
    }
  } else {
    const fullBlob = await response.blob();
    receivedBytes = fullBlob.size;
  }

  const blob = chunks.length > 0
    ? new Blob(chunks as BlobPart[], { type: 'audio/mpeg' })
    : await response.blob();

  const cache = await caches.open(CACHE_NAME);
  const cacheKey = `/offline-audio/${makeSurahKey(reciterId, surahNumber)}.mp3`;
  const cachedResponse = new Response(blob, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(blob.size),
      'X-Yaqeen-Offline': 'true',
    },
  });
  await cache.put(cacheKey, cachedResponse);

  const record: OfflineSurahRecord = {
    id: makeSurahKey(reciterId, surahNumber),
    surahNumber,
    surahName,
    reciterId,
    reciterName,
    streamUrl,
    fileSizeBytes: blob.size,
    downloadedAt: new Date().toISOString(),
    mimeType: 'audio/mpeg',
  };

  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error || new Error('Failed to save offline record.'));
  });

  return record;
}

/**
 * Delete a downloaded surah from cache and database.
 */
export async function deleteOfflineSurah(reciterId: string, surahNumber: number): Promise<void> {
  const key = makeSurahKey(reciterId, surahNumber);
  try {
    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(`/offline-audio/${key}.mp3`);
    }
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to delete offline surah:', err);
  }
}

/**
 * List all downloaded surahs.
 */
export async function listOfflineSurahs(): Promise<OfflineSurahRecord[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as OfflineSurahRecord[]) || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Calculate storage usage for the Yaqeen offline audio cache.
 */
export async function getStorageUsageEstimate(): Promise<{
  usedBytes: number;
  quotaBytes: number;
  percentage: number;
}> {
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || 1;
      const percentage = Math.min(100, Math.round((used / quota) * 100));
      return { usedBytes: used, quotaBytes: quota, percentage };
    } catch {
      // Fallback
    }
  }

  // Fallback: sum records in IndexedDB
  const records = await listOfflineSurahs();
  const sum = records.reduce((acc, r) => acc + (r.fileSizeBytes || 0), 0);
  return { usedBytes: sum, quotaBytes: 1024 * 1024 * 1024 * 5, percentage: 1 };
}

/**
 * Delete all offline surahs.
 */
export async function clearAllOfflineAudio(): Promise<void> {
  try {
    if ('caches' in window) {
      await caches.delete(CACHE_NAME);
    }
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to clear offline audio cache:', err);
  }
}
