import type { Metadata } from "next";
import Link from "next/link";
import { ProjectsList } from "@/components/dashboard/ProjectsList";
import { demoProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "My Projects | RenoVision AI",
  description: "Manage your room visualization projects, drafts, and client-ready concepts.",
};

export default function ProjectsPage() {
  const activeCount = demoProjects.filter((p) => p.status === "Active").length;
  const draftCount = demoProjects.filter((p) => p.status === "Draft").length;

  return (
    <>
      <header className="mb-8 sm:mb-10">
        <Link
          href="/dashboard"
          className="text-sm text-muted transition hover:text-gold-light"
        >
          ← Back to Dashboard
        </Link>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
          Projects
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          My Projects
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Manage your room visualization projects, drafts, and client-ready concepts.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link href="/dashboard/upload" className="btn-primary text-center">
            New Visualization
          </Link>
          <p className="text-xs text-muted sm:text-sm">
            {activeCount} active · {draftCount} draft · {demoProjects.length} total
          </p>
        </div>
      </header>

      <ProjectsList projects={demoProjects} />
    </>
  );
}
