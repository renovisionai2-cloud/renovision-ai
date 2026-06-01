"use client";

import {
  getRoomUploadBlob,
  getRoomUploadMeta,
  SAMPLE_ROOM_SRC,
  type RoomUploadRecord,
} from "@/lib/room-upload-store";

async function postRoomImageToServer(
  record: RoomUploadRecord,
  blob: Blob,
): Promise<void> {
  const formData = new FormData();
  formData.append("uploadId", record.id);
  formData.append("storageKey", record.storageKey);
  formData.append("file", blob, record.fileName);

  const response = await fetch("/api/upload/room-image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let message = "Failed to sync room photo to the server.";
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

/** Stores the active room image on the server (multipart) for render submission. */
export async function syncRoomUploadToServer(record: RoomUploadRecord): Promise<void> {
  if (record.source === "sample") {
    const response = await fetch(SAMPLE_ROOM_SRC);
    if (!response.ok) {
      throw new Error("Unable to load the sample room for rendering.");
    }
    const blob = await response.blob();
    await postRoomImageToServer(record, blob);
    return;
  }

  const blob = await getRoomUploadBlob(record.storageKey);
  if (!blob) {
    throw new Error("Unable to read the uploaded room photo.");
  }

  await postRoomImageToServer(record, blob);
}

/** Ensures the server has the current room upload before calling /api/render/submit. */
export async function ensureRoomUploadOnServer(): Promise<RoomUploadRecord> {
  const meta = getRoomUploadMeta();
  if (!meta) {
    throw new Error("Upload a room photo before generating a design.");
  }

  await syncRoomUploadToServer(meta);
  return meta;
}
