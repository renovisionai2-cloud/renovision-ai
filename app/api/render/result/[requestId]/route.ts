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
    const result = await provider.fetchResult(requestId, session.modelId);

    patchRenderSession(requestId, {
      status: "completed",
      afterImageUrl: result.afterImageUrl,
    });

    renderLog("Render result fetched", { requestId });

    return NextResponse.json({
      requestId,
      afterImageUrl: result.afterImageUrl,
      seed: result.seed,
    });
  } catch (error) {
    return renderApiError(error);
  }
}
