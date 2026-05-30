import type { RenderProviderId } from "@/lib/generation/types";

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/** Client-visible provider id (no secrets). */
export function getClientRenderProviderId(): RenderProviderId {
  const fromEnv = process.env.NEXT_PUBLIC_RENDER_PROVIDER?.trim().toLowerCase();
  if (
    fromEnv === "fal" ||
    fromEnv === "mock" ||
    fromEnv === "openai" ||
    fromEnv === "replicate" ||
    fromEnv === "stability"
  ) {
    return fromEnv;
  }
  return "fal";
}

export function getClientPollConfig(): { timeoutMs: number; intervalMs: number } {
  return {
    timeoutMs: parseNumber(process.env.NEXT_PUBLIC_RENDER_REQUEST_TIMEOUT_MS, 120_000),
    intervalMs: parseNumber(process.env.NEXT_PUBLIC_RENDER_POLL_INTERVAL_MS, 2_000),
  };
}
