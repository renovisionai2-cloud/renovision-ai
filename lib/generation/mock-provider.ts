import { persistGeneratedDesign } from "@/lib/generation/persist-result";
import type {
  RenderProvider,
  RenderRequest,
  RenderResult,
  RenderStatusResponse,
  RenderSubmission,
  GenerationPhase,
} from "@/lib/generation/types";
import type { UploadStyleId } from "@/lib/upload-styles";

export { getStyleLabel, STYLE_GENERATION_CONTEXT } from "@/lib/generation/style-context";

const PLACEHOLDER_AFTER = "/demo/after.jpg";

const PHASE_DELAYS_MS: Record<Exclude<GenerationPhase, "complete">, number> = {
  uploading_image: 700,
  preparing_render: 900,
  generating_ai_visualization: 2200,
  finalizing: 800,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Local mock provider for offline development without API keys. */
export const mockRenderProvider: RenderProvider = {
  id: "mock",

  async submitRender(request: RenderRequest): Promise<RenderSubmission> {
    return {
      externalJobId: `mock-${request.jobId}`,
      provider: "mock",
    };
  },

  async pollRenderStatus(externalJobId: string): Promise<RenderStatusResponse> {
    void externalJobId;
    return { phase: "generating_ai_visualization", progress: 50, status: "running" };
  },

  async fetchCompletedResult(
    externalJobId: string,
    request: RenderRequest,
  ): Promise<RenderResult> {
    void externalJobId;
    const { createDesignId } = await import("@/lib/generation/persist-result");
    const designId = createDesignId(request.styleId);
    return persistGeneratedDesign(request, PLACEHOLDER_AFTER, designId);
  },
};

export async function runMockGenerationPipeline(
  jobId: string,
  styleId: UploadStyleId,
  onPhase: (phase: GenerationPhase) => void,
): Promise<RenderResult> {
  const submission = await mockRenderProvider.submitRender({
    jobId,
    styleId,
    uploadId: "mock",
    beforeImageUrl: PLACEHOLDER_AFTER,
  });

  const phases: Exclude<GenerationPhase, "complete">[] = [
    "uploading_image",
    "preparing_render",
    "generating_ai_visualization",
    "finalizing",
  ];

  for (const phase of phases) {
    onPhase(phase);
    await sleep(PHASE_DELAYS_MS[phase]);
    await mockRenderProvider.pollRenderStatus(submission.externalJobId);
  }

  const result = await mockRenderProvider.fetchCompletedResult(
    submission.externalJobId,
    {
      jobId,
      styleId,
      uploadId: "mock",
      beforeImageUrl: PLACEHOLDER_AFTER,
    },
  );

  onPhase("complete");
  return result;
}
