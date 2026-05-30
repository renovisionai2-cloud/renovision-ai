import Image from "next/image";
import { CreateVariationButton } from "@/components/dashboard/CreateVariationButton";
import { DesignImage } from "@/components/dashboard/DesignImage";
import { ExportDesignButton } from "@/components/dashboard/ExportDesignButton";
import { SaveToProjectButton } from "@/components/dashboard/SaveToProjectButton";
import { designRecommendations, getDesignTitle, type SavedDesign } from "@/lib/saved-designs";

const cardBase =
  "premium-frame card-glow flex h-full min-w-0 flex-col rounded-3xl bg-surface-elevated/50 p-6 sm:p-8";
const btnPrimary =
  "btn-primary inline-flex min-h-[2.75rem] w-full items-center justify-center !px-5 !py-2.5 text-sm";
const btnSecondary =
  "btn-secondary inline-flex min-h-[2.75rem] w-full items-center justify-center !px-5 !py-2.5 text-sm";
const btnDanger =
  "inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-full border border-red-500/30 bg-red-950/30 px-8 py-3.5 text-sm font-medium text-red-300/90 transition hover:border-red-400/40 hover:bg-red-950/50";

const previewLabelBefore =
  "absolute top-3 left-3 z-10 rounded-md border border-border/80 bg-background/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted backdrop-blur-md sm:top-4 sm:left-4 sm:text-xs";
const previewLabelAfter =
  "absolute top-3 right-3 z-10 rounded-md bg-gradient-to-r from-gold-dim via-gold to-gold-light px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-background shadow-lg shadow-gold/20 sm:top-4 sm:right-4 sm:text-xs";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border/60 py-3 last:border-0 last:pb-0 first:pt-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground sm:text-base">{value}</p>
    </div>
  );
}

type DesignDetailContentProps = {
  design: SavedDesign;
};

export function DesignDetailContent({ design }: DesignDetailContentProps) {
  return (
    <div className="min-w-0 space-y-6 lg:space-y-8">
      <section
        className="premium-frame card-glow overflow-hidden rounded-3xl bg-gradient-to-br from-surface-elevated/90 via-surface to-surface-elevated/50 shadow-[0_32px_64px_-20px_rgba(0,0,0,0.65),0_0_0_1px_rgba(201,169,98,0.08)]"
        aria-label="Before and after design preview"
      >
        <div className="p-3 sm:p-4 md:p-5">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface shadow-inner sm:rounded-2xl md:aspect-[16/11] lg:aspect-[4/3]">
              <DesignImage
                design={design}
                variant="before"
                alt={`${design.roomName} before renovation`}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <figcaption className={previewLabelBefore}>Before</figcaption>
            </figure>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface shadow-inner sm:rounded-2xl md:aspect-[16/11] lg:aspect-[4/3]">
              <Image
                src={design.afterImage}
                alt={`${design.roomName} ${design.styleName} AI preview`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <figcaption className={previewLabelAfter}>After</figcaption>
            </figure>
          </div>
        </div>
        <p className="border-t border-border/60 px-5 py-3.5 text-center text-xs leading-relaxed text-muted sm:px-8 sm:py-4 sm:text-sm">
          <span className="font-medium text-foreground">{getDesignTitle(design)}</span>
          <span className="text-muted"> · AI visualization preview</span>
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
        <section className={cardBase}>
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
            Design Details
          </h2>
          <div className="mt-6 flex-1">
            <DetailRow label="Room" value={design.roomName} />
            <DetailRow label="Style" value={design.styleName} />
            <DetailRow label="Created" value={design.createdAt} />
            <DetailRow label="Project" value={design.projectName} />
            <DetailRow label="Status" value={design.status} />
          </div>
        </section>

        <section className={cardBase}>
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
            Actions
          </h2>
          <p className="mt-1 flex-1 text-sm text-muted sm:flex-none">
            Export, save, or iterate on this concept.
          </p>
          <div className="mt-auto flex flex-col gap-2 pt-6">
            <ExportDesignButton design={design} className={btnPrimary} />
            <SaveToProjectButton design={design} className={btnSecondary} />
            <CreateVariationButton design={design} className={btnSecondary} />
            <button type="button" className={`${btnDanger} mt-1`}>
              Delete Design
            </button>
          </div>
        </section>

        <section className={cardBase}>
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
            Notes & Recommendations
          </h2>
          <p className="mt-4 flex-1 text-sm leading-relaxed text-muted sm:mt-6 sm:text-base">
            {designRecommendations}
          </p>
        </section>
      </div>
    </div>
  );
}
