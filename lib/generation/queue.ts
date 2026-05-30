import { phaseProgress } from "@/lib/generation/phases";
import { runGenerationPipeline, toRenderErrorMessage } from "@/lib/generation/pipeline";
import { runMockGenerationPipeline } from "@/lib/generation/mock-provider";
import { getActiveRenderProviderId } from "@/lib/generation/providers";
import { upsertRenderJob, getRenderJob } from "@/lib/generation/store";
import type { GenerationPhase, RenderJob } from "@/lib/generation/types";
import { getRoomUploadMeta } from "@/lib/room-upload-store";
import type { UploadStyleId } from "@/lib/upload-styles";

/** Step 1 — create a render request (queue entry). */
export async function createRenderRequest(styleId: UploadStyleId): Promise<RenderJob> {
  const uploadMeta = getRoomUploadMeta();
  if (!uploadMeta) {
    throw new Error("Upload a room photo before generating a design.");
  }

  const provider = getActiveRenderProviderId();
  const now = new Date().toISOString();
  const job: RenderJob = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: "queued",
    phase: "uploading_image",
    progress: 0,
    styleId,
    uploadId: uploadMeta.id,
    provider,
  };

  upsertRenderJob(job);
  return job;
}

/** Step 2–4 — execute render (status updates + completed result). */
export async function executeRenderJob(
  jobId: string,
  onUpdate?: (job: RenderJob) => void,
): Promise<RenderJob> {
  const existing = getRenderJob(jobId);
  if (!existing) {
    throw new Error("Generation job not found.");
  }

  if (existing.status === "completed" && existing.resultDesignId) {
    return existing;
  }

  const patchJob = (partial: Partial<RenderJob>) => {
    const current = getRenderJob(jobId) ?? existing;
    const next: RenderJob = {
      ...current,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    upsertRenderJob(next);
    onUpdate?.(next);
    return next;
  };

  patchJob({ status: "running", phase: "uploading_image", progress: 0 });

  const providerId = existing.provider;

  try {
    const runPipeline =
      providerId === "mock"
        ? (onPhase: (phase: GenerationPhase) => void) =>
            runMockGenerationPipeline(jobId, existing.styleId, onPhase)
        : (onPhase: (phase: GenerationPhase) => void) =>
            runGenerationPipeline(
              jobId,
              existing.styleId,
              providerId,
              onPhase,
              (submission) => {
                patchJob({
                  externalJobId: submission.externalJobId,
                  providerModelId: submission.modelId,
                });
              },
            );

    const result = await runPipeline((phase: GenerationPhase) => {
      patchJob({
        status: phase === "complete" ? "completed" : "running",
        phase,
        progress: phaseProgress(phase),
      });
    });

    return patchJob({
      status: "completed",
      phase: "complete",
      progress: 100,
      resultDesignId: result.designId,
    });
  } catch (error) {
    return patchJob({
      status: "failed",
      error: toRenderErrorMessage(error),
    });
  }
}

export function getRenderStatus(jobId: string): RenderJob | null {
  return getRenderJob(jobId);
}
