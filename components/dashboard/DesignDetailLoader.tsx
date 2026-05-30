"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { DesignDetailContent } from "@/components/dashboard/DesignDetailContent";
import { resolveDesignById } from "@/lib/design-variations-store";
import { getDesignTitle, type SavedDesign } from "@/lib/saved-designs";

type DesignDetailLoaderProps = {
  designId: string;
  initialDesign: SavedDesign | null;
};

export function DesignDetailLoader({ designId, initialDesign }: DesignDetailLoaderProps) {
  const [design, setDesign] = useState<SavedDesign | null>(initialDesign);
  const [resolved, setResolved] = useState(Boolean(initialDesign));

  useEffect(() => {
    if (initialDesign) return;
    const found = resolveDesignById(designId);
    setDesign(found ?? null);
    setResolved(true);
  }, [designId, initialDesign]);

  if (!resolved) {
    return <p className="text-sm text-muted">Loading design preview…</p>;
  }

  if (!design) {
    notFound();
  }

  return (
    <>
      <header className="mb-8 sm:mb-10">
        <Link
          href="/dashboard/designs"
          className="text-sm text-muted transition hover:text-gold-light"
        >
          ← Back to Designs
        </Link>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
          Design Preview
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {getDesignTitle(design)}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
            {design.status}
          </span>
          <span className="rounded-full border border-border bg-surface-elevated/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-light">
            AI Preview
          </span>
          <span className="rounded-full border border-border bg-background/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
            {design.projectName}
          </span>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Before and after AI visualization preview.
        </p>
      </header>

      <DesignDetailContent design={design} />
    </>
  );
}
