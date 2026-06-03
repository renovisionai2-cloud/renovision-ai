import "server-only";

import type { RenderProviderId } from "@/lib/generation/types";

export type RenderServerConfig = {
  provider: RenderProviderId;
  falKey: string | null;
  falModelId: string;
  falStrength: number;
  falGuidanceScale: number;
  falNumInferenceSteps: number;
  falOutputFormat: "jpeg" | "png";
  requestTimeoutMs: number;
  pollIntervalMs: number;
  webhookUrl: string | null;
};

function parseProvider(value: string | undefined): RenderProviderId {
  const normalized = value?.trim().toLowerCase();
  if (
    normalized === "fal" ||
    normalized === "mock" ||
    normalized === "openai" ||
    normalized === "replicate" ||
    normalized === "stability"
  ) {
    return normalized;
  }
  return "fal";
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/** Server-side render configuration from environment variables. */
export function getRenderServerConfig(): RenderServerConfig {
  const falKey = process.env.FAL_KEY?.trim() || process.env.FAL_AI_API_KEY?.trim() || null;
  const provider = parseProvider(process.env.RENDER_PROVIDER);

  return {
    provider: provider === "fal" && !falKey ? "mock" : provider,
    falKey,
    falModelId:
      process.env.FAL_MODEL_ID?.trim() || "fal-ai/flux/dev/image-to-image",
    falStrength: parseNumber(process.env.FAL_IMAGE_STRENGTH, 0.35),
    falGuidanceScale: parseNumber(process.env.FAL_GUIDANCE_SCALE, 3.5),
    falNumInferenceSteps: Math.round(parseNumber(process.env.FAL_INFERENCE_STEPS, 40)),
    falOutputFormat: process.env.FAL_OUTPUT_FORMAT === "png" ? "png" : "jpeg",
    requestTimeoutMs: parseNumber(process.env.RENDER_REQUEST_TIMEOUT_MS, 120_000),
    pollIntervalMs: parseNumber(process.env.RENDER_POLL_INTERVAL_MS, 2_000),
    webhookUrl: process.env.RENDER_WEBHOOK_URL?.trim() || null,
  };
}
