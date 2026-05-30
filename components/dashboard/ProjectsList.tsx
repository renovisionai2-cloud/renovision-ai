import Link from "next/link";
import type { DemoProject } from "@/lib/projects";
import { ProjectCard } from "@/components/dashboard/ProjectCard";

type ProjectsListProps = {
  projects: DemoProject[];
};

export function ProjectsList({ projects }: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className="premium-frame flex flex-col items-center justify-center rounded-3xl bg-surface-elevated/40 px-6 py-16 text-center sm:py-24">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <svg
            className="h-8 w-8 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9M6 21h12"
            />
          </svg>
        </span>
        <p className="mt-6 max-w-md text-base text-muted sm:text-lg">
          No projects yet. Start a new visualization to create your first project.
        </p>
        <Link href="/dashboard/upload" className="btn-primary mt-8">
          Start New Visualization
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.id} className="list-none">
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}
