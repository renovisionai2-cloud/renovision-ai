import { RenderProviderError } from "@/lib/generation/errors";
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
    void request;
    throw new RenderProviderError(
      "NOT_CONFIGURED",
      "Mock render provider is disabled. Configure FAL_KEY and RENDER_PROVIDER=fal.",
    );
  },
};

export async function runMockGenerationPipeline(
  jobId: string,
  styleId: UploadStyleId,
  onPhase: (phase: GenerationPhase) => void,
): Promise<RenderResult> {
  void jobId;
  void styleId;
  void onPhase;
  void PHASE_DELAYS_MS;
  void sleep;
  throw new RenderProviderError(
    "NOT_CONFIGURED",
    "Mock render provider is disabled. Configure FAL_KEY and RENDER_PROVIDER=fal.",
  );
}
