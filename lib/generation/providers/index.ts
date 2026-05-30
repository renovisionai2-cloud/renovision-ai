import { getClientRenderProviderId } from "@/lib/generation/client-config";
import { falClientRenderProvider } from "@/lib/generation/providers/fal-client-provider";
import { mockRenderProvider } from "@/lib/generation/mock-provider";
import type { RenderProvider, RenderProviderId } from "@/lib/generation/types";

/**
 * Client provider registry — UI and pipeline call these proxies only.
 * Server-side adapters live under lib/generation/providers/server/.
 */
const providerRegistry: Partial<Record<RenderProviderId, RenderProvider>> = {
  mock: mockRenderProvider,
  fal: falClientRenderProvider,
  // replicate: replicateClientRenderProvider,
  // openai: openaiClientRenderProvider,
  // stability: stabilityClientRenderProvider,
};

export function getRenderProvider(providerId: RenderProviderId): RenderProvider {
  const provider = providerRegistry[providerId];
  if (!provider) {
    throw new Error(
      `Render provider "${providerId}" is not registered. Add a client adapter in lib/generation/providers/.`,
    );
  }
  return provider;
}

export function isRenderProviderConfigured(providerId: RenderProviderId): boolean {
  return Boolean(providerRegistry[providerId]);
}

/** Resolves the active client provider (defaults to Fal). */
export function getActiveRenderProviderId(): RenderProviderId {
  const preferred = getClientRenderProviderId();
  if (isRenderProviderConfigured(preferred)) {
    return preferred;
  }
  return "mock";
}

/** Whether the active client provider is Fal (server must have FAL_KEY configured). */
export function isFalServerConfigured(): boolean {
  return getActiveRenderProviderId() === "fal";
}
