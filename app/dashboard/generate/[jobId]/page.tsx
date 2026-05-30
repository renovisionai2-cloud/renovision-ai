import type { Metadata } from "next";
import { GenerationProgressClient } from "@/components/dashboard/GenerationProgressClient";

export const metadata: Metadata = {
  title: "Generating Design | RenoVision AI",
  description: "AI visualization generation in progress.",
};

type PageProps = {
  params: Promise<{ jobId: string }>;
};

export default async function GeneratePage({ params }: PageProps) {
  const { jobId } = await params;
  return <GenerationProgressClient jobId={jobId} />;
}
