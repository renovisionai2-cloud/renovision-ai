import "server-only";

export type CachedRoomUpload = {
  uploadId: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  buffer: Buffer;
  cachedAt: number;
};

const TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, CachedRoomUpload>();

function pruneExpired(now: number): void {
  for (const [key, entry] of cache) {
    if (now - entry.cachedAt > TTL_MS) {
      cache.delete(key);
    }
  }
}

export function setCachedRoomUpload(entry: CachedRoomUpload): void {
  pruneExpired(Date.now());
  cache.set(entry.uploadId, entry);
}

export function getCachedRoomUpload(uploadId: string): CachedRoomUpload | undefined {
  const entry = cache.get(uploadId);
  if (!entry) return undefined;
  if (Date.now() - entry.cachedAt > TTL_MS) {
    cache.delete(uploadId);
    return undefined;
  }
  return entry;
}

export function bufferToImageDataUrl(buffer: Buffer, mimeType: string): string {
  const base64 = buffer.toString("base64");
  return `data:${mimeType};base64,${base64}`;
}
