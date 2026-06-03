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
const DIAG = "[renovision:diag:resolve-before-image]";

function logDataUriDiagnostics(
  uploadId: string,
  mimeType: string,
  sizeBytes: number,
  dataUri: string,
  source: string,
): void {
  console.info(DIAG, {
    uploadId,
    mimeType,
    sizeBytes,
    source,
    dataUriLength: dataUri.length,
    dataUriPrefix100: dataUri.slice(0, 100),
  });
}

async function loadSampleRoomDataUrl(origin: string): Promise<string> {
  try {
    const sampleUrl = new URL(SAMPLE_ROOM_RELATIVE, origin).toString();
    const response = await fetch(sampleUrl, { cache: "no-store" });
    if (response.ok) {
      const blob = await response.arrayBuffer();
      const mimeType = response.headers.get("content-type") ?? "image/jpeg";
      const buffer = Buffer.from(blob);
      const dataUri = bufferToImageDataUrl(buffer, mimeType);
      logDataUriDiagnostics("sample-room", mimeType, buffer.length, dataUri, "fetch");
      return dataUri;
    }
  } catch {
    // fall through to filesystem read (local dev)
  }

  const filePath = path.join(process.cwd(), "public", "demo", "before.jpg");
  const buffer = await readFile(filePath);
  const dataUri = bufferToImageDataUrl(buffer, "image/jpeg");
  logDataUriDiagnostics("sample-room", "image/jpeg", buffer.length, dataUri, "filesystem");
  return dataUri;
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
    const dataUri = bufferToImageDataUrl(cached.buffer, cached.mimeType);
    logDataUriDiagnostics(
      uploadId,
      cached.mimeType,
      cached.sizeBytes,
      dataUri,
      "server-cache",
    );
    return dataUri;
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
