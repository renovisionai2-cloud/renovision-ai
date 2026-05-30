"use client";

import { copyDesignImageBlob, saveDesignImageFromUrl } from "@/lib/design-image-store";
import { addGeneratedDesign } from "@/lib/generated-designs-store";
import type { RenderRequest, RenderResult } from "@/lib/generation/types";
import { STYLE_GENERATION_CONTEXT } from "@/lib/generation/style-context";
import {
  getRoomUploadMeta,
  SAMPLE_ROOM_SRC,
} from "@/lib/room-upload-store";
import type { UploadStyleId } from "@/lib/upload-styles";
import { RenderProviderError } from "@/lib/generation/errors";

const FALLBACK_AFTER = "/demo/after.jpg";

function formatCreatedDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function createDesignId(styleId: UploadStyleId): string {
  const suffix = Date.now().toString(36).slice(-6);
  return `gen-${styleId}-${suffix}`;
}

/** Persists a completed provider result into local generated-design storage. */
export async function persistGeneratedDesign(
  request: RenderRequest,
  afterImageUrl: string,
  designId?: string,
): Promise<RenderResult> {
  const id = designId ?? createDesignId(request.styleId);
  const context = STYLE_GENERATION_CONTEXT[request.styleId];
  const uploadMeta = getRoomUploadMeta();

  let beforeImage = request.beforeImageUrl;
  let beforeStorageKey: string | undefined;
  let afterImage = FALLBACK_AFTER;
  let afterStorageKey: string | undefined;

  if (uploadMeta?.source === "upload" && uploadMeta.storageKey) {
    beforeStorageKey = `design-before-${id}`;
    await copyDesignImageBlob(uploadMeta.storageKey, beforeStorageKey);
    beforeImage = SAMPLE_ROOM_SRC;
  } else {
    beforeImage = SAMPLE_ROOM_SRC;
  }

  try {
    afterStorageKey = `design-after-${id}`;
    await saveDesignImageFromUrl(afterImageUrl, afterStorageKey);
    afterImage = FALLBACK_AFTER;
  } catch {
    if (!afterImageUrl.startsWith("http")) {
      throw new RenderProviderError(
        "INVALID_RESPONSE",
        "The provider returned an invalid image result.",
      );
    }
    afterImage = afterImageUrl;
    afterStorageKey = undefined;
  }

  addGeneratedDesign({
    id,
    roomName: context.roomName,
    styleName: context.styleLabel,
    createdAt: formatCreatedDate(new Date()),
    beforeImage,
    afterImage,
    projectName: context.projectName,
    status: "Ready",
    generationJobId: request.jobId,
    beforeStorageKey,
    afterStorageKey,
  });

  return { afterImageUrl: afterImage, designId: id };
}
