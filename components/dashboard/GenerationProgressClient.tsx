"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  GENERATION_PHASE_LABELS,
  GENERATION_PHASE_ORDER,
} from "@/lib/generation/phases";
import { getStyleLabel } from "@/lib/generation/style-context";
import { executeRenderJob, getRenderStatus } from "@/lib/generation/queue";
import { RENDER_JOB_CHANGED_EVENT } from "@/lib/generation/store";
import type { GenerationPhase, RenderJob } from "@/lib/generation/types";

type GenerationProgressClientProps = {
  jobId: string;
};

function phaseIndex(phase: GenerationPhase): number {
  return GENERATION_PHASE_ORDER.indexOf(phase);
}

export function GenerationProgressClient({ jobId }: GenerationProgressClientProps) {
  const router = useRouter();
  const startedRef = useRef(false);
  const [hydrated, setHydrated] = useState(false);
  const [job, setJob] = useState<RenderJob | null>(null);

  useEffect(() => {
    setHydrated(true);
    setJob(getRenderStatus(jobId));
  }, [jobId]);

  useEffect(() => {
    if (!hydrated) return;

    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{ jobId: string }>).detail;
      if (detail?.jobId === jobId) {
        setJob(getRenderStatus(jobId));
      }
    };

    window.addEventListener(RENDER_JOB_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(RENDER_JOB_CHANGED_EVENT, onChange);
  }, [hydrated, jobId]);

  useEffect(() => {
    if (!hydrated || startedRef.current) return;
    startedRef.current = true;

    void executeRenderJob(jobId, setJob).then((completed) => {
      if (completed.status === "completed" && completed.resultDesignId) {
        router.replace(`/dashboard/designs/${completed.resultDesignId}`);
      }
    });
  }, [hydrated, jobId, router]);

  useEffect(() => {
    if (!hydrated) return;
    if (job?.status === "completed" && job.resultDesignId) {
      router.replace(`/dashboard/designs/${job.resultDesignId}`);
    }
  }, [hydrated, job, router]);

  if (!hydrated) {
    return <p className="text-sm text-muted">Loading generation status…</p>;
  }

  if (!job) {
    return (
      <>
        <p className="text-sm text-muted">Generation job not found.</p>
        <Link href="/dashboard/upload" className="mt-4 inline-block text-sm text-gold-light">
          ← Back to upload
        </Link>
      </>
    );
  }

  const activeIndex = phaseIndex(job.phase);
  const styleLabel = getStyleLabel(job.styleId);

  return (
    <>
      <header className="mb-8">
        <Link
          href="/dashboard/upload"
          className="text-sm text-muted transition hover:text-gold-light"
        >
          ← Back to upload
        </Link>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
          AI Generation
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-semibold tracking-tight sm:text-4xl">
          Generating your design
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
          Applying the <span className="text-gold-light">{styleLabel}</span> style to your
          uploaded room photo.
        </p>
      </header>

      <div className="premium-frame rounded-3xl bg-surface-elevated/40 p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="relative flex h-16 w-16 items-center justify-center">
            <span className="absolute inset-0 rounded-full border-2 border-gold/20" />
            {job.status !== "failed" && job.phase !== "complete" && (
              <span className="absolute inset-0 animate-ping rounded-full border border-gold/30" />
            )}
            <span
              className={`h-8 w-8 rounded-full border-2 border-gold border-t-transparent ${
                job.status === "failed" ? "hidden" : "animate-spin"
              }`}
            />
          </span>
          <p className="mt-6 text-sm font-medium text-gold-light">
            {job.status === "failed"
              ? "Generation failed"
              : GENERATION_PHASE_LABELS[job.phase]}
          </p>
          {job.status !== "failed" && (
            <p className="mt-1 text-xs text-muted">{job.progress}% complete</p>
          )}
          {job.error && (
            <p className="mt-2 max-w-md text-xs text-red-300/90">{job.error}</p>
          )}
        </div>

        <div className="mt-8 h-2 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-dim via-gold to-gold-light transition-all duration-500"
            style={{ width: `${job.progress}%` }}
          />
        </div>

        <ol className="mt-8 space-y-3">
          {GENERATION_PHASE_ORDER.filter((phase) => phase !== "complete").map((phase) => {
            const index = phaseIndex(phase);
            const isDone = activeIndex > index || job.phase === "complete";
            const isActive = job.phase === phase && job.status === "running";

            return (
              <li
                key={phase}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                  isActive
                    ? "border-gold/40 bg-gold/10 text-gold-light"
                    : isDone
                      ? "border-border bg-background/30 text-foreground"
                      : "border-border/60 bg-background/20 text-muted"
                }`}
              >
                <span>{GENERATION_PHASE_LABELS[phase]}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  {isDone ? "Done" : isActive ? "In progress" : "Pending"}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
