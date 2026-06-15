import { isKnownProjectId, PROJECT_NAME_TO_ID, type ProjectDesign } from "@/lib/projects";
import type { SavedDesign } from "@/lib/saved-designs";

export const PROJECT_DESIGN_STORE_KEY = "renovision-project-design-saves";
export const PROJECT_DESIGN_SAVED_EVENT = "renovision-project-design-saved";

/** Persisted save record — structured for future Supabase `project_designs` rows. */
export type SavedProjectDesignRecord = {
  id: string;
  projectId: string;
  savedDesignId: string;
  styleName: string;
  createdAt: string;
  beforeImage: string;
  afterImage: string;
  savedAt: string;
};

type ProjectDesignStore = {
  version: 1;
  saves: SavedProjectDesignRecord[];
};

function emptyStore(): ProjectDesignStore {
  return { version: 1, saves: [] };
}

function readStore(): ProjectDesignStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(PROJECT_DESIGN_STORE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as ProjectDesignStore;
    if (parsed?.version !== 1 || !Array.isArray(parsed.saves)) return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

function writeStore(store: ProjectDesignStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROJECT_DESIGN_STORE_KEY, JSON.stringify(store));
}

export function getProjectIdForDesign(design: SavedDesign): string | null {
  return PROJECT_NAME_TO_ID[design.projectName] ?? null;
}

function recordToProjectDesign(record: SavedProjectDesignRecord): ProjectDesign {
  return {
    id: record.id,
    projectId: record.projectId,
    styleName: record.styleName,
    createdAt: record.createdAt,
    beforeImage: record.beforeImage,
    afterImage: record.afterImage,
    savedDesignId: record.savedDesignId,
  };
}

export function getDesignsForProjectFromStore(projectId: string): ProjectDesign[] {
  return readStore()
    .saves.filter((save) => save.projectId === projectId)
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
    .map(recordToProjectDesign);
}

export function mergeDesignsForProject(
  projectId: string,
  seedDesigns: ProjectDesign[],
): ProjectDesign[] {
  const seen = new Set(seedDesigns.map((design) => design.savedDesignId));
  const merged = [...seedDesigns];

  if (typeof window === "undefined") return merged;

  for (const save of readStore().saves) {
    if (save.projectId !== projectId || seen.has(save.savedDesignId)) continue;
    merged.push(recordToProjectDesign(save));
    seen.add(save.savedDesignId);
  }

  return merged;
}

export function isDesignSavedToProject(savedDesignId: string, projectId: string): boolean {
  return readStore().saves.some(
    (entry) => entry.projectId === projectId && entry.savedDesignId === savedDesignId,
  );
}

export function isDesignSavedToLinkedProject(design: SavedDesign): boolean {
  const projectId = getProjectIdForDesign(design);
  if (!projectId) return false;
  return isDesignSavedToProject(design.id, projectId);
}

export type SaveDesignToProjectResult = "saved" | "already_saved" | "error";

/** Persists a design save to localStorage (mock layer before Supabase). */
export function saveDesignToProject(design: SavedDesign): SaveDesignToProjectResult {
  const projectId = getProjectIdForDesign(design);
  if (!projectId || !isKnownProjectId(projectId)) {
    return "error";
  }

  if (isDesignSavedToProject(design.id, projectId)) {
    return "already_saved";
  }

  const store = readStore();
  const record: SavedProjectDesignRecord = {
    id: `user-${design.id}-${projectId}`,
    projectId,
    savedDesignId: design.id,
    styleName: design.styleName,
    createdAt: design.createdAt,
    beforeImage: design.beforeImage,
    afterImage: design.afterImage,
    savedAt: new Date().toISOString(),
  };

  store.saves.push(record);
  writeStore(store);
  window.dispatchEvent(new CustomEvent(PROJECT_DESIGN_SAVED_EVENT));
  return "saved";
}
