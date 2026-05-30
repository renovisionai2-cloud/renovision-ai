import Link from "next/link";
import type { SavedDesign } from "@/lib/saved-designs";
import { DesignCard } from "@/components/dashboard/DesignCard";

type SavedDesignsGalleryProps = {
  designs: SavedDesign[];
};

export function SavedDesignsGallery({ designs }: SavedDesignsGalleryProps) {
  if (designs.length === 0) {
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
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 012.828 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 012.828 0l2.829 2.829a2.25 2.25 0 010 3.182l-5.159 5.159m-1.5-1.5l-1.409 1.409a2.25 2.25 0 01-3.182 0l-2.829-2.829a2.25 2.25 0 010-3.182l5.159-5.159"
            />
          </svg>
        </span>
        <p className="mt-6 max-w-md text-base text-muted sm:text-lg">
          No saved designs yet. Start a new visualization to create your first design.
        </p>
        <Link href="/dashboard/upload" className="btn-primary mt-8">
          Start New Visualization
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2 xl:grid-cols-2">
      {designs.map((design) => (
        <li key={design.id} className="list-none">
          <DesignCard design={design} />
        </li>
      ))}
    </ul>
  );
}
