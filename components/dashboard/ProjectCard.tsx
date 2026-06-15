import Link from "next/link";
import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
};

function statusStyles(status: Project["status"]) {
  if (status === "Active") {
    return "border-gold/30 bg-gold/10 text-gold";
  }
  return "border-border bg-surface-elevated/80 text-muted";
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="card-glow premium-frame flex flex-col rounded-2xl bg-surface-elevated/50 p-5 transition duration-500 hover:border-gold/30 sm:rounded-3xl sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-foreground sm:text-2xl">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-muted">{project.roomType}</p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusStyles(project.status)}`}
        >
          {project.status}
        </span>
      </div>

      <ul className="mt-5 flex flex-wrap gap-4 border-y border-border/80 py-4 text-xs text-muted sm:text-sm">
        <li>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-gold/80">
            Last updated
          </span>
          <span className="mt-0.5 text-foreground/90">{project.lastUpdated}</span>
        </li>
        <li>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-gold/80">
            Designs
          </span>
          <span className="mt-0.5 font-[family-name:var(--font-cormorant)] text-lg font-semibold text-gold-light">
            {project.designCount}
          </span>
        </li>
      </ul>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          href={`/dashboard/projects/${project.id}`}
          className="btn-primary flex-1 !px-4 !py-2.5 text-sm text-center sm:flex-[1.2]"
        >
          Open Project
        </Link>
        <button type="button" className="btn-secondary flex-1 !px-4 !py-2.5 text-sm">
          Rename
        </button>
        <button
          type="button"
          className="rounded-full border border-border px-4 py-2.5 text-sm text-muted transition hover:border-red-400/40 hover:text-red-300/90 sm:flex-initial"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
