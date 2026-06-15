import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ProjectDesignCount,
  ProjectDesignsSection,
} from "@/components/dashboard/ProjectDesignsSection";
import {
  getProjectDefinition,
  listCatalogProjects,
  PROJECT_CATALOG,
  type Project,
} from "@/lib/projects";

type PageProps = {
  params: Promise<{ projectId: string }>;
};

export function generateStaticParams() {
  return PROJECT_CATALOG.map((project) => ({ projectId: project.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectId } = await params;
  const project = getProjectDefinition(projectId);
  return {
    title: project ? `${project.name} | RenoVision AI` : "Project | RenoVision AI",
    description: project
      ? `View designs and details for ${project.name}.`
      : "Project details",
  };
}

function statusStyles(status: Project["status"]) {
  if (status === "Active") {
    return "border-gold/30 bg-gold/10 text-gold";
  }
  return "border-border bg-surface-elevated/80 text-muted";
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { projectId } = await params;
  const definition = getProjectDefinition(projectId);

  if (!definition) {
    notFound();
  }

  const project =
    listCatalogProjects().find((entry) => entry.id === projectId) ?? {
      ...definition,
      status: "Active" as const,
      lastUpdated: "—",
      designCount: 0,
    };

  return (
    <>
      <header className="mb-8">
        <Link
          href="/dashboard/projects"
          className="text-sm text-muted transition hover:text-gold-light"
        >
          ← Back to Projects
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
            Project
          </p>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusStyles(project.status)}`}
          >
            {project.status}
          </span>
        </div>
        <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {project.name}
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">{project.roomType}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:gap-10 xl:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <section className="premium-frame rounded-3xl bg-gradient-to-br from-surface-elevated/80 via-surface to-surface-elevated/40 p-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
              Project Overview
            </h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-3">
              <li>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gold/80">
                  Room type
                </span>
                <p className="mt-1 text-base text-foreground">{project.roomType}</p>
              </li>
              <li>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gold/80">
                  Last updated
                </span>
                <p className="mt-1 text-base text-foreground">{project.lastUpdated}</p>
              </li>
              <li>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gold/80">
                  Designs
                </span>
                <ProjectDesignCount
                  projectId={projectId}
                  seedDesigns={[]}
                  fallback={0}
                />
              </li>
            </ul>
          </section>

          <ProjectDesignsSection projectId={projectId} seedDesigns={[]} />
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <section className="premium-frame rounded-2xl bg-surface-elevated/50 p-6 sm:rounded-3xl">
            <h2 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold sm:text-2xl">
              Project Actions
            </h2>
            <p className="mt-1 text-sm text-muted">
              Manage this project and add new visualizations.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/dashboard/upload" className="btn-primary text-center">
                Add New Design
              </Link>
              <button type="button" className="btn-secondary">
                Rename Project
              </button>
              <button
                type="button"
                className="rounded-full border border-border px-4 py-3 text-sm text-muted transition hover:border-red-400/40 hover:text-red-300/90"
              >
                Delete Project
              </button>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
