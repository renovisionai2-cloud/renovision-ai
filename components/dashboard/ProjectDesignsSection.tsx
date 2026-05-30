"use client";

import { useCallback, useEffect, useState } from "react";
import { ProjectDesignCard } from "@/components/dashboard/ProjectDesignCard";
import { DESIGN_CATALOG_CHANGED_EVENT } from "@/lib/design-variations-store";
import {
  mergeDesignsForProject,
  PROJECT_DESIGN_SAVED_EVENT,
} from "@/lib/project-design-store";
import type { ProjectDesign } from "@/lib/projects";

type ProjectDesignsSectionProps = {
  projectId: string;
  seedDesigns: ProjectDesign[];
};

export function ProjectDesignCount({
  projectId,
  seedDesigns,
  fallback,
}: {
  projectId: string;
  seedDesigns: ProjectDesign[];
  fallback: number;
}) {
  const [count, setCount] = useState(fallback);

  const refreshCount = useCallback(() => {
    setCount(mergeDesignsForProject(projectId, seedDesigns).length);
  }, [projectId, seedDesigns]);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  useEffect(() => {
    const onSaved = () => refreshCount();
    window.addEventListener(PROJECT_DESIGN_SAVED_EVENT, onSaved);
    window.addEventListener(DESIGN_CATALOG_CHANGED_EVENT, onSaved);
    return () => {
      window.removeEventListener(PROJECT_DESIGN_SAVED_EVENT, onSaved);
      window.removeEventListener(DESIGN_CATALOG_CHANGED_EVENT, onSaved);
    };
  }, [refreshCount]);

  return (
    <p className="mt-1 font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-gold-light">
      {count}
    </p>
  );
}

export function ProjectDesignsSection({ projectId, seedDesigns }: ProjectDesignsSectionProps) {
  const [designs, setDesigns] = useState<ProjectDesign[]>(seedDesigns);

  const refreshDesigns = useCallback(() => {
    setDesigns(mergeDesignsForProject(projectId, seedDesigns));
  }, [projectId, seedDesigns]);

  useEffect(() => {
    refreshDesigns();
  }, [refreshDesigns]);

  useEffect(() => {
    const onSaved = () => refreshDesigns();
    window.addEventListener(PROJECT_DESIGN_SAVED_EVENT, onSaved);
    window.addEventListener(DESIGN_CATALOG_CHANGED_EVENT, onSaved);
    return () => {
      window.removeEventListener(PROJECT_DESIGN_SAVED_EVENT, onSaved);
      window.removeEventListener(DESIGN_CATALOG_CHANGED_EVENT, onSaved);
    };
  }, [refreshDesigns]);

  return (
    <section>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold sm:text-3xl">
            Saved Designs
          </h2>
          <p className="mt-1 text-sm text-muted">Room visualizations saved in this project.</p>
        </div>
        <p className="text-xs text-muted">
          {designs.length} design{designs.length === 1 ? "" : "s"}
        </p>
      </div>

      {designs.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2">
          {designs.map((design) => (
            <li key={design.id} className="list-none">
              <ProjectDesignCard design={design} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="premium-frame rounded-2xl bg-surface-elevated/40 p-8 text-center text-sm text-muted">
          No designs in this project yet.
        </div>
      )}
    </section>
  );
}
