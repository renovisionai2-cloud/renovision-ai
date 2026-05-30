import { getRenderServerConfig } from "@/lib/generation/config";
import { RenderProviderError } from "@/lib/generation/errors";
import { falServerProvider } from "@/lib/generation/providers/server/fal-provider";
import type { ServerRenderProvider } from "@/lib/generation/providers/server/types";
import type { RenderProviderId } from "@/lib/generation/types";

const serverProviders: Partial<Record<RenderProviderId, ServerRenderProvider>> = {
  fal: falServerProvider,
  // replicate: replicateServerProvider,
  // openai: openaiServerProvider,
  // stability: stabilityServerProvider,
};

export function getServerRenderProvider(
  providerId?: RenderProviderId,
): ServerRenderProvider {
  const config = getRenderServerConfig();
  const id = providerId ?? config.provider;

  const provider = serverProviders[id];
  if (!provider) {
    throw new RenderProviderError(
      "NOT_CONFIGURED",
      `Server render provider "${id}" is not configured.`,
    );
  }

  return provider;
}
