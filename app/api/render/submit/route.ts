import { NextResponse } from "next/server";
import { renderApiError } from "@/lib/generation/api-utils";
import { getRenderServerConfig } from "@/lib/generation/config";
import { RenderProviderError } from "@/lib/generation/errors";
import { renderLog } from "@/lib/generation/logger";
import { upsertRenderSession } from "@/lib/generation/providers/server/render-sessions";
import { getServerRenderProvider } from "@/lib/generation/providers/server/registry";
import type { UploadStyleId } from "@/lib/upload-styles";
import { uploadStyleOptions } from "@/lib/upload-styles";

type SubmitBody = {
  jobId?: string;
  styleId?: UploadStyleId;
  uploadId?: string;
  beforeImageDataUrl?: string;
};

function isValidStyleId(value: string): value is UploadStyleId {
  return uploadStyleOptions.some((option) => option.id === value);
}

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "NOT_CONFIGURED" }, { status: 401 });
    }

    const body = (await request.json()) as SubmitBody;
    const { jobId, styleId, uploadId, beforeImageDataUrl } = body;

    if (!jobId || !styleId || !uploadId || !beforeImageDataUrl) {
      throw new RenderProviderError(
        "UPLOAD_MISSING",
        "Missing render submission fields.",
      );
    }

    if (!isValidStyleId(styleId)) {
      throw new RenderProviderError("INVALID_RESPONSE", "Invalid design style.");
    }

    if (!beforeImageDataUrl.startsWith("data:image/")) {
      throw new RenderProviderError(
        "INVALID_RESPONSE",
        "Before image must be a valid image data URI.",
      );
    }

    const config = getRenderServerConfig();
    if (config.provider !== "fal" || !config.falKey) {
      throw new RenderProviderError(
        "NOT_CONFIGURED",
        "Fal.ai is not configured on the server. Set FAL_KEY and RENDER_PROVIDER=fal.",
      );
    }

    const provider = getServerRenderProvider("fal");
    const submission = await provider.submit({
      jobId,
      styleId,
      uploadId,
      beforeImageDataUrl,
    });

    upsertRenderSession({
      requestId: submission.requestId,
      jobId,
      styleId,
      uploadId,
      modelId: submission.modelId,
      provider: "fal",
      status: "queued",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    renderLog("Render submitted", { jobId, requestId: submission.requestId });

    return NextResponse.json({
      requestId: submission.requestId,
      provider: submission.provider,
      modelId: submission.modelId,
    });
  } catch (error) {
    return renderApiError(error);
  }
}
