"use client";

import Image from "next/image";
import Link from "next/link";
import { DesignImage } from "@/components/dashboard/DesignImage";
import type { SavedDesign } from "@/lib/saved-designs";

type DesignCardProps = {
  design: SavedDesign;
};

export function DesignCard({ design }: DesignCardProps) {
  return (
    <article className="card-glow premium-frame flex flex-col overflow-hidden rounded-2xl bg-surface-elevated/50 transition duration-500 hover:border-gold/30 sm:rounded-3xl">
      <div className="grid grid-cols-2 gap-px bg-border/80">
        <figure className="relative aspect-[4/3] bg-surface">
          <DesignImage
            design={design}
            variant="before"
            alt={`${design.roomName} before`}
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 200px"
          />
          <figcaption className="absolute bottom-2 left-2 rounded-md bg-background/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted backdrop-blur-sm">
            Before
          </figcaption>
        </figure>
        <figure className="relative aspect-[4/3] bg-surface">
          <Image
            src={design.afterImage}
            alt={`${design.roomName} AI preview`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 200px"
          />
          <figcaption className="absolute bottom-2 right-2 rounded-md bg-gradient-to-r from-gold-dim via-gold to-gold-light px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-background">
            AI Preview
          </figcaption>
        </figure>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-foreground sm:text-2xl">
              {design.roomName}
            </h3>
            <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
              {design.styleName}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">Created {design.createdAt}</p>
        </div>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/dashboard/designs/${design.id}`}
            className="btn-primary flex-1 !px-4 !py-2.5 text-center text-sm"
          >
            View Design
          </Link>
          <button type="button" className="btn-secondary flex-1 !px-4 !py-2.5 text-sm">
            Export
          </button>
        </div>
      </div>
    </article>
  );
}
