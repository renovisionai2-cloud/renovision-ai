import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { RenderProviderError } from "@/lib/generation/errors";
import { renderLog } from "@/lib/generation/logger";
import {
  bufferToImageDataUrl,
  getCachedRoomUpload,
} from "@/lib/generation/providers/server/room-upload-cache";

const SAMPLE_ROOM_RELATIVE = "/demo/before.jpg";

async function loadSampleRoomDataUrl(origin: string): Promise<string> {
  try {
    const sampleUrl = new URL(SAMPLE_ROOM_RELATIVE, origin).toString();
    const response = await fetch(sampleUrl, { cache: "no-store" });
    if (response.ok) {
      const blob = await response.arrayBuffer();
      const mimeType = response.headers.get("content-type") ?? "image/jpeg";
      return bufferToImageDataUrl(Buffer.from(blob), mimeType);
    }
  } catch {
    // fall through to filesystem read (local dev)
  }

  const filePath = path.join(process.cwd(), "public", "demo", "before.jpg");
  const buffer = await readFile(filePath);
  return bufferToImageDataUrl(buffer, "image/jpeg");
}

/** Resolves the before image for Fal from the server-side room upload cache. */
export async function resolveBeforeImageDataUrl(
  uploadId: string,
  requestOrigin: string,
): Promise<string> {
  const cached = getCachedRoomUpload(uploadId);
  if (cached) {
    renderLog("Resolved before image from server cache", {
      uploadId,
      sizeBytes: cached.sizeBytes,
      mimeType: cached.mimeType,
    });
    return bufferToImageDataUrl(cached.buffer, cached.mimeType);
  }

  if (uploadId === "sample-room") {
    renderLog("Resolved sample room before image", { uploadId });
    return loadSampleRoomDataUrl(requestOrigin);
  }

  throw new RenderProviderError(
    "UPLOAD_MISSING",
    "Room photo is not available on the server. Re-upload your photo and try again.",
  );
}
