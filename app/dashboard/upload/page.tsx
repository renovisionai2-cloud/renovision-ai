import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { UploadRoomClient } from "@/components/dashboard/UploadRoomClient";

export const metadata: Metadata = {
  title: "Upload Room | RenoVision AI",
  description: "Upload a room photo and generate an AI interior design visualization.",
};

export default function UploadRoomPage() {
  return (
    <>
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-muted transition hover:text-gold-light"
        >
          ← Dashboard
        </Link>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
          New visualization
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-semibold tracking-tight sm:text-4xl">
          Upload your room
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
          Add a photo, pick a style, and preview how RenoVision AI will transform your space.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="premium-frame flex min-h-[320px] items-center justify-center rounded-3xl text-sm text-muted">
            Loading upload…
          </div>
        }
      >
        <UploadRoomClient />
      </Suspense>
    </>
  );
}
