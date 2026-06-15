import type { Metadata } from "next";
import Link from "next/link";
import { SavedDesignsGalleryClient } from "@/components/dashboard/SavedDesignsGalleryClient";
import { SavedDesignsCountLabel } from "@/components/dashboard/SavedDesignsCount";

export const metadata: Metadata = {
  title: "Saved Designs | RenoVision AI",
  description: "Browse your AI-generated room concepts and before/after previews.",
};

export default function SavedDesignsPage() {
  return (
    <>
      <header className="mb-8 sm:mb-10">
        <Link
          href="/dashboard"
          className="text-sm text-muted transition hover:text-gold-light"
        >
          ← Dashboard
        </Link>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
          Gallery
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Saved Designs
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Browse your AI-generated room concepts and before/after previews.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/dashboard/upload" className="btn-primary text-center">
            New Visualization
          </Link>
          <p className="text-xs text-muted sm:text-sm">
            <SavedDesignsCountLabel fallback={0} />
          </p>
        </div>
      </header>

      <SavedDesignsGalleryClient />
    </>
  );
}
