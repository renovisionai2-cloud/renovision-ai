import { getGeneratedDesignById, getAllGeneratedDesigns } from "@/lib/generated-designs-store";
import { getProjectIdForDesign, PROJECT_DESIGN_SAVED_EVENT, saveDesignToProject } from "@/lib/project-design-store";
import { demoSavedDesigns, getDesignById, type SavedDesign } from "@/lib/saved-designs";

export const DESIGN_VARIATIONS_KEY = "renovision-design-variations";
export const DESIGN_CATALOG_CHANGED_EVENT = "renovision-design-catalog-changed";

export type StoredDesignVariation = SavedDesign & {
  baseDesignId: string;
  version: number;
};

type DesignVariationStore = {
  version: 1;
  variations: StoredDesignVariation[];
};

function emptyStore(): DesignVariationStore {
  return { version: 1, variations: [] };
}

function readStore(): DesignVariationStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(DESIGN_VARIATIONS_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as DesignVariationStore;
    if (parsed?.version !== 1 || !Array.isArray(parsed.variations)) return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

function writeStore(store: DesignVariationStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DESIGN_VARIATIONS_KEY, JSON.stringify(store));
}

function notifyCatalogChanged(): void {
  window.dispatchEvent(new CustomEvent(DESIGN_CATALOG_CHANGED_EVENT));
  window.dispatchEvent(new CustomEvent(PROJECT_DESIGN_SAVED_EVENT));
}

export function getBaseDesignId(design: SavedDesign): string {
  return design.baseDesignId ?? design.id.replace(/-v\d+$/i, "");
}

export function getBaseStyleName(styleName: string): string {
  return styleName.replace(/\sv\d+$/i, "").trim();
}

function formatDemoDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getAllVariations(): StoredDesignVariation[] {
  return readStore().variations;
}

export function getVariationById(designId: string): StoredDesignVariation | undefined {
  return getAllVariations().find((variation) => variation.id === designId);
}

export function resolveDesignById(designId: string): SavedDesign | undefined {
  return getDesignById(designId) ?? getVariationById(designId) ?? getGeneratedDesignById(designId);
}

export function getGalleryDesigns(): SavedDesign[] {
  return [...demoSavedDesigns, ...getAllVariations(), ...getAllGeneratedDesigns()];
}

export function getSavedDesignsCount(): number {
  return getGalleryDesigns().length;
}

function getNextVariationVersion(baseDesignId: string): number {
  let maxVersion = 1;

  for (const variation of getAllVariations()) {
    if (variation.baseDesignId === baseDesignId) {
      maxVersion = Math.max(maxVersion, variation.version);
    }
  }

  return maxVersion + 1;
}

export type CreateVariationResult =
  | { ok: true; variation: StoredDesignVariation }
  | { ok: false; reason: "missing_project" | "duplicate" };

/** Creates a variation, persists to localStorage, and links it to the project store. */
export function createDesignVariation(source: SavedDesign): CreateVariationResult {
  const projectId = getProjectIdForDesign(source);
  if (!projectId) {
    return { ok: false, reason: "missing_project" };
  }

  const baseDesignId = getBaseDesignId(source);
  const version = getNextVariationVersion(baseDesignId);
  const baseStyle = getBaseStyleName(source.styleName);
  const id = `${baseDesignId}-v${version}`;

  if (resolveDesignById(id)) {
    return { ok: false, reason: "duplicate" };
  }

  const variation: StoredDesignVariation = {
    id,
    baseDesignId,
    version,
    roomName: source.roomName,
    styleName: `${baseStyle} v${version}`,
    createdAt: formatDemoDate(new Date()),
    beforeImage: source.beforeImage,
    afterImage: source.afterImage,
    projectName: source.projectName,
    status: "Ready",
  };

  const store = readStore();
  store.variations.push(variation);
  writeStore(store);

  saveDesignToProject(variation);
  notifyCatalogChanged();

  return { ok: true, variation };
}
