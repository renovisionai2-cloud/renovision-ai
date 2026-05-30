import { saveDesignToProject } from "@/lib/project-design-store";
import { DESIGN_CATALOG_CHANGED_EVENT } from "@/lib/design-variations-store";
import type { SavedDesign } from "@/lib/saved-designs";

export const GENERATED_DESIGNS_KEY = "renovision-generated-designs";

export type GeneratedDesign = SavedDesign & {
  generationJobId: string;
  beforeStorageKey?: string;
  afterStorageKey?: string;
};

type GeneratedDesignStore = {
  version: 1;
  designs: GeneratedDesign[];
};

function emptyStore(): GeneratedDesignStore {
  return { version: 1, designs: [] };
}

function readStore(): GeneratedDesignStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(GENERATED_DESIGNS_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as GeneratedDesignStore;
    if (parsed?.version !== 1 || !Array.isArray(parsed.designs)) return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

function writeStore(store: GeneratedDesignStore): void {
  localStorage.setItem(GENERATED_DESIGNS_KEY, JSON.stringify(store));
}

export function getAllGeneratedDesigns(): GeneratedDesign[] {
  return readStore().designs;
}

export function getGeneratedDesignById(designId: string): GeneratedDesign | undefined {
  return getAllGeneratedDesigns().find((design) => design.id === designId);
}

export function addGeneratedDesign(design: GeneratedDesign): void {
  const store = readStore();
  if (store.designs.some((entry) => entry.id === design.id)) return;
  store.designs.unshift(design);
  writeStore(store);
  saveDesignToProject(design);
  window.dispatchEvent(new CustomEvent(DESIGN_CATALOG_CHANGED_EVENT));
}
