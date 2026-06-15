"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useDashboardUser } from "@/components/dashboard/DashboardShell";
import { SavedDesignsCountLabel } from "@/components/dashboard/SavedDesignsCount";
import { DESIGN_CATALOG_CHANGED_EVENT, getSavedDesignsCount } from "@/lib/design-variations-store";
import { PROJECT_DESIGN_SAVED_EVENT } from "@/lib/project-design-store";

export function WelcomeSection() {
  const { welcomeName } = useDashboardUser();
  const [activeProjects, setActiveProjects] = useState(0);
  const [savedDesigns, setSavedDesigns] = useState(0);

  const refreshStats = useCallback(() => {
    setActiveProjects(0);
    setSavedDesigns(getSavedDesignsCount());
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  useEffect(() => {
    const onChange = () => refreshStats();
    window.addEventListener(DESIGN_CATALOG_CHANGED_EVENT, onChange);
    window.addEventListener(PROJECT_DESIGN_SAVED_EVENT, onChange);
    return () => {
      window.removeEventListener(DESIGN_CATALOG_CHANGED_EVENT, onChange);
      window.removeEventListener(PROJECT_DESIGN_SAVED_EVENT, onChange);
    };
  }, [refreshStats]);

  const displayName = welcomeName || "there";

  return (
    <section className="premium-frame mb-8 rounded-3xl bg-gradient-to-br from-surface-elevated/80 via-surface to-surface-elevated/40 p-6 sm:mb-10 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            Welcome back
          </p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]">
            Hello,{" "}
            {displayName === "there" ? (
              <span>there</span>
            ) : (
              <span className="gradient-text">{displayName}</span>
            )}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Your RenoVision AI workspace is ready. Upload a room, explore saved
            designs, and manage your plan — all in one premium dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end xl:flex-row">
          <Link href="/dashboard/upload" className="btn-primary whitespace-nowrap text-center">
            Start New Visualization
          </Link>
          <button type="button" className="btn-secondary whitespace-nowrap">
            View Tutorial
          </button>
        </div>
      </div>

      <ul className="mt-8 grid grid-cols-3 gap-4 border-t border-border/80 pt-6 sm:gap-6">
        {[
          { value: String(activeProjects), label: "Active projects" },
          { value: String(savedDesigns), label: "Saved designs" },
          { value: "8", label: "Renders left" },
        ].map((stat) => (
          <li key={stat.label}>
            <p className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-gold-light sm:text-2xl">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[10px] text-muted sm:text-xs">{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
