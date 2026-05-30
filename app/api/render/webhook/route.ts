import { NextResponse } from "next/server";
import { renderLog } from "@/lib/generation/logger";
import {
  getRenderSession,
  patchRenderSession,
} from "@/lib/generation/providers/server/render-sessions";
import { getServerRenderProvider } from "@/lib/generation/providers/server/registry";

type FalWebhookPayload = {
  request_id?: string;
  status?: string;
  error?: string;
};

/**
 * Fal.ai webhook receiver — updates in-memory render sessions for async completion.
 * Configure with RENDER_WEBHOOK_URL pointing to this route.
 */
export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as FalWebhookPayload;
    const requestId = payload.request_id;

    if (!requestId) {
      return NextResponse.json({ ok: false, error: "Missing request_id" }, { status: 400 });
    }

    const session = getRenderSession(requestId);
    if (!session) {
      renderLog("Webhook for unknown session", { requestId });
      return NextResponse.json({ ok: true, ignored: true });
    }

    if (payload.status === "FAILED") {
      patchRenderSession(requestId, {
        status: "failed",
        error: payload.error ?? "Fal.ai reported a failed generation.",
      });
      return NextResponse.json({ ok: true });
    }

    if (payload.status === "COMPLETED" || payload.status === "OK") {
      const provider = getServerRenderProvider(session.provider);
      const result = await provider.fetchResult(requestId, session.modelId);
      patchRenderSession(requestId, {
        status: "completed",
        afterImageUrl: result.afterImageUrl,
      });
      renderLog("Webhook completed session", { requestId });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    renderLog("Webhook error", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
