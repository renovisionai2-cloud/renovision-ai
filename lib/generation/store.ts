import type { RenderJob } from "@/lib/generation/types";

export const RENDER_JOBS_KEY = "renovision-render-jobs";
export const GENERATION_HISTORY_KEY = "renovision-generation-history";
export const RENDER_JOB_CHANGED_EVENT = "renovision-render-job-changed";

type RenderJobStore = {
  version: 1;
  jobs: RenderJob[];
};

function emptyStore(): RenderJobStore {
  return { version: 1, jobs: [] };
}

function readStore(): RenderJobStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(RENDER_JOBS_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as RenderJobStore;
    if (parsed?.version !== 1 || !Array.isArray(parsed.jobs)) return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

function writeStore(store: RenderJobStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(RENDER_JOBS_KEY, JSON.stringify(store));
}

function readHistory(): RenderJob[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GENERATION_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RenderJob[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeHistory(jobs: RenderJob[]): void {
  localStorage.setItem(GENERATION_HISTORY_KEY, JSON.stringify(jobs));
}

export function notifyRenderJobChanged(jobId: string): void {
  window.dispatchEvent(
    new CustomEvent(RENDER_JOB_CHANGED_EVENT, { detail: { jobId } }),
  );
}

export function getRenderJob(jobId: string): RenderJob | null {
  return readStore().jobs.find((job) => job.id === jobId) ?? null;
}

export function upsertRenderJob(job: RenderJob): void {
  const store = readStore();
  const index = store.jobs.findIndex((entry) => entry.id === job.id);
  if (index >= 0) {
    store.jobs[index] = job;
  } else {
    store.jobs.push(job);
  }
  writeStore(store);

  const history = readHistory();
  const historyIndex = history.findIndex((entry) => entry.id === job.id);
  const historyEntry = { ...job };
  if (historyIndex >= 0) {
    history[historyIndex] = historyEntry;
  } else {
    history.unshift(historyEntry);
  }
  writeHistory(history.slice(0, 50));

  notifyRenderJobChanged(job.id);
}

export function getGenerationHistory(): RenderJob[] {
  return readHistory();
}
