/**
 * Room upload persistence — local IndexedDB + metadata in localStorage.
 * Replace `persistRoomUpload` / `getPersistedBeforeImageUrl` with Supabase Storage
 * calls while keeping `RoomUploadRecord` as the app-facing contract.
 */

import { SERVER_ROOM_UPLOAD_MAX_BYTES } from "@/lib/generation/request-limits";

export const ROOM_UPLOAD_META_KEY = "renovision-room-upload-meta";
/** Aligned with Vercel function body limit for server-side room sync. */
export const MAX_UPLOAD_BYTES = SERVER_ROOM_UPLOAD_MAX_BYTES;
export const ACCEPTED_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const ACCEPTED_UPLOAD_ACCEPT =
  "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

export type RoomUploadSource = "upload";

/** App-facing upload record — maps to a future Supabase `room_uploads` row + storage object. */
export type RoomUploadRecord = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  source: RoomUploadSource;
  /** Local IndexedDB key today; Supabase Storage path tomorrow. */
  storageKey: string;
};

export type UploadValidationResult =
  | { ok: true }
  | { ok: false; error: string };

const IDB_NAME = "renovision-ai-room-uploads";
const IDB_VERSION = 1;
const IDB_STORE = "blobs";

function openUploadDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open upload storage."));
  });
}

function idbPutBlob(key: string, blob: Blob): Promise<void> {
  return openUploadDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put(blob, key);
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error ?? new Error("Failed to save uploaded image."));
        };
      }),
  );
}

function idbGetBlob(key: string): Promise<Blob | null> {
  return openUploadDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, "readonly");
        const request = tx.objectStore(IDB_STORE).get(key);
        request.onsuccess = () => {
          db.close();
          resolve((request.result as Blob | undefined) ?? null);
        };
        request.onerror = () => {
          db.close();
          reject(request.error ?? new Error("Failed to read uploaded image."));
        };
      }),
  );
}

export function validateRoomUploadFile(file: File): UploadValidationResult {
  if (!ACCEPTED_UPLOAD_MIME_TYPES.includes(file.type as (typeof ACCEPTED_UPLOAD_MIME_TYPES)[number])) {
    return {
      ok: false,
      error: "Please upload a JPG, PNG, or WEBP image.",
    };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: "File must be 4 MB or smaller.",
    };
  }

  if (file.size === 0) {
    return { ok: false, error: "The selected file is empty." };
  }

  return { ok: true };
}

export function getRoomUploadMeta(): RoomUploadRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ROOM_UPLOAD_META_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RoomUploadRecord;
    if (!parsed?.id || !parsed.storageKey) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeRoomUploadMeta(record: RoomUploadRecord): void {
  localStorage.setItem(ROOM_UPLOAD_META_KEY, JSON.stringify(record));
}

/** Saves a user file locally (IndexedDB). Swap internals for Supabase Storage upload. */
export async function persistRoomUpload(file: File): Promise<RoomUploadRecord> {
  const validation = validateRoomUploadFile(file);
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const id = crypto.randomUUID();
  const storageKey = `room-upload-${id}`;

  await idbPutBlob(storageKey, file);

  const record: RoomUploadRecord = {
    id,
    fileName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    uploadedAt: new Date().toISOString(),
    source: "upload",
    storageKey,
  };

  writeRoomUploadMeta(record);
  return record;
}

/** Reads the persisted upload blob from IndexedDB. */
export async function getRoomUploadBlob(storageKey: string): Promise<Blob | null> {
  return idbGetBlob(storageKey);
}

/** Resolves the persisted before-image URL for visualization steps. */
export async function getPersistedBeforeImageUrl(): Promise<string | null> {
  const meta = getRoomUploadMeta();
  if (!meta) return null;

  const blob = await idbGetBlob(meta.storageKey);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export function createPreviewUrlFromFile(file: File): string {
  return URL.createObjectURL(file);
}
