import "server-only";

const IMAGE_URL_KEY =
  /^(url|image_url|image_urls|output_url|result_url|file_url|content_url)$/i;
const CACHE_KEY = /cache/i;

function isProbableImageUrl(value: string): boolean {
  if (value.startsWith("data:image/")) return true;
  if (!/^https?:\/\//i.test(value)) return false;
  return (
    value.includes("fal.media") ||
    value.includes("fal.run") ||
    /\.(jpe?g|png|webp|gif)(\?|$)/i.test(value) ||
    value.includes("/files/")
  );
}

function collectImageUrlsFromValue(
  value: unknown,
  urls: Set<string>,
  depth: number,
): void {
  if (depth > 12 || value == null) return;

  if (typeof value === "string") {
    if (isProbableImageUrl(value)) urls.add(value);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectImageUrlsFromValue(item, urls, depth + 1);
    return;
  }

  if (typeof value !== "object") return;

  for (const [key, child] of Object.entries(value)) {
    if (typeof child === "string" && (IMAGE_URL_KEY.test(key) || isProbableImageUrl(child))) {
      if (isProbableImageUrl(child)) urls.add(child);
      continue;
    }
    collectImageUrlsFromValue(child, urls, depth + 1);
  }
}

function collectCacheIndicators(
  value: unknown,
  path: string,
  out: Record<string, unknown>,
  depth: number,
): void {
  if (depth > 12 || value == null) return;
  if (typeof value !== "object") return;

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectCacheIndicators(item, `${path}[${index}]`, out, depth + 1),
    );
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    const nextPath = path ? `${path}.${key}` : key;
    if (CACHE_KEY.test(key)) {
      out[nextPath] = child;
    }
    collectCacheIndicators(child, nextPath, out, depth + 1);
  }
}

function readSeed(data: unknown): number | string | null {
  if (!data || typeof data !== "object") return null;
  const seed = (data as { seed?: unknown }).seed;
  if (typeof seed === "number" && Number.isFinite(seed)) return seed;
  if (typeof seed === "string" && seed.length > 0) return seed;
  return null;
}

function readOutputImageUrls(data: unknown): string[] {
  if (!data || typeof data !== "object") return [];
  const images = (data as { images?: unknown }).images;
  if (!Array.isArray(images)) return [];

  return images
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const url = (item as { url?: unknown }).url;
      return typeof url === "string" && url.length > 0 ? url : null;
    })
    .filter((url): url is string => url !== null);
}

export type FalQueueResultEnvelope = {
  data: unknown;
  requestId: string;
};

/** Logs Fal queue.result payload for production debugging (Vercel function logs). */
export function logFalQueueResultDiagnostics(options: {
  requestId: string;
  modelId: string;
  result: FalQueueResultEnvelope;
  selectedOutputImageUrl: string | null;
}): void {
  const { requestId, modelId, result, selectedOutputImageUrl } = options;
  const allImageUrls = new Set<string>();
  collectImageUrlsFromValue(result, allImageUrls, 0);

  const outputImageUrls = readOutputImageUrls(result.data);
  for (const url of outputImageUrls) allImageUrls.add(url);

  const cacheIndicators: Record<string, unknown> = {};
  collectCacheIndicators(result, "", cacheIndicators, 0);
  const seed = readSeed(result.data);

  let fullResponseJson: string;
  try {
    fullResponseJson = JSON.stringify(result);
  } catch {
    fullResponseJson = "[unserializable fal queue result]";
  }

  console.info("[renovision:diag:fal-result] kontext queue result received", {
    requestId,
    falRequestIdFromEnvelope: result.requestId,
    falRequestIdMatchesParam:
      result.requestId.length === 0 || result.requestId === requestId,
    modelId,
    seed,
    cacheIndicators:
      Object.keys(cacheIndicators).length > 0 ? cacheIndicators : null,
    outputImageUrls,
    allImageUrls: [...allImageUrls],
    selectedOutputImageUrl,
    dataKeys:
      result.data && typeof result.data === "object"
        ? Object.keys(result.data as object)
        : null,
  });

  console.info(
    "[renovision:diag:fal-result] full fal response json",
    fullResponseJson,
  );
}
