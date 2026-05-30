import { NextResponse } from "next/server";
import { renderApiError } from "@/lib/generation/api-utils";
import { RenderProviderError } from "@/lib/generation/errors";
import { renderLog } from "@/lib/generation/logger";
import {
  getRenderSession,
  patchRenderSession,
} from "@/lib/generation/providers/server/render-sessions";
import { getServerRenderProvider } from "@/lib/generation/providers/server/registry";

type RouteContext = {
  params: Promise<{ requestId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { requestId } = await context.params;
    const session = getRenderSession(requestId);

    if (!session) {
      throw new RenderProviderError(
        "INVALID_RESPONSE",
        "Render session not found.",
      );
    }

    const provider = getServerRenderProvider(session.provider);
    const status = await provider.pollStatus(requestId, session.modelId);

    patchRenderSession(requestId, {
      status: status.status,
      afterImageUrl: status.afterImageUrl,
      error: status.error,
    });

    renderLog("Render status", { requestId, status: status.status, phase: status.phase });

    return NextResponse.json({
      requestId,
      modelId: session.modelId,
      provider: session.provider,
      status: status.status,
      phase: status.phase,
      progress: status.progress,
      error: status.error,
      afterImageUrl: status.afterImageUrl,
    });
  } catch (error) {
    return renderApiError(error);
  }
}
