import { getRenderProvider } from "@/lib/generation/providers";
import { upsertRenderJob, getRenderJob } from "@/lib/generation/store";
import { phaseProgress } from "@/lib/generation/phases";
import type { RenderJob, RenderStatusResponse } from "@/lib/generation/types";

/**
 * Poll or apply webhook status for async provider jobs (Replicate, Fal, etc.).
 * Wire this from a `/api/render/webhook` route or a client polling loop.
 */
export async function syncRenderJobFromProvider(jobId: string): Promise<RenderJob | null> {
  const job = getRenderJob(jobId);
  if (!job?.externalJobId || job.status === "completed" || job.status === "failed") {
    return job;
  }

  const provider = getRenderProvider(job.provider);
  const status: RenderStatusResponse = await provider.pollRenderStatus(job.externalJobId);

  const next: RenderJob = {
    ...job,
    status: status.status,
    phase: status.phase,
    progress: status.progress,
    error: status.error,
    updatedAt: new Date().toISOString(),
  };

  upsertRenderJob(next);
  return next;
}

export function applyWebhookStatus(jobId: string, status: RenderStatusResponse): RenderJob | null {
  const job = getRenderJob(jobId);
  if (!job) return null;

  const next: RenderJob = {
    ...job,
    status: status.status,
    phase: status.phase,
    progress: status.progress ?? phaseProgress(status.phase),
    error: status.error,
    updatedAt: new Date().toISOString(),
  };

  upsertRenderJob(next);
  return next;
}
