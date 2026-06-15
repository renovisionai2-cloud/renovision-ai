import "server-only";

import { RenderProviderError } from "@/lib/generation/errors";
import { renderLog } from "@/lib/generation/logger";
import {
  bufferToImageDataUrl,
  getCachedRoomUpload,
} from "@/lib/generation/providers/server/room-upload-cache";

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

/** Resolves the before image for Fal from the server-side room upload cache. */
export async function resolveBeforeImageDataUrl(
  uploadId: string,
  _requestOrigin: string,
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

  throw new RenderProviderError(
    "UPLOAD_MISSING",
    "Room photo is not available on the server. Re-upload your photo and try again.",
  );
}
