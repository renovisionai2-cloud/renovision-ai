"use client";

import { getPersistedBeforeImageUrl, getRoomUploadMeta } from "@/lib/room-upload-store";
import { RenderProviderError } from "@/lib/generation/errors";

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to encode image."));
    reader.readAsDataURL(blob);
  });
}

async function urlToDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new RenderProviderError(
      "UPLOAD_MISSING",
      "Unable to read the uploaded room photo.",
    );
  }
  const blob = await response.blob();
  return blobToDataUrl(blob);
}

/** Encodes the active before image as a data URI for server-side provider submission. */
export async function getBeforeImageDataUrl(): Promise<string> {
  const meta = getRoomUploadMeta();
  if (!meta) {
    throw new RenderProviderError(
      "UPLOAD_MISSING",
      "Upload a room photo before generating a design.",
    );
  }

  const previewUrl = await getPersistedBeforeImageUrl();
  if (!previewUrl) {
    throw new RenderProviderError(
      "UPLOAD_MISSING",
      "Unable to read the uploaded room photo.",
    );
  }

  if (previewUrl.startsWith("data:")) {
    return previewUrl;
  }

  return urlToDataUrl(previewUrl);
}
