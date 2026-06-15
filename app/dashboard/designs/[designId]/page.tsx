import type { Metadata } from "next";
import { DesignDetailLoader } from "@/components/dashboard/DesignDetailLoader";

type PageProps = {
  params: Promise<{ designId: string }>;
};

export const metadata: Metadata = {
  title: "Design Preview | RenoVision AI",
  description: "Before and after AI visualization preview.",
};

export default async function DesignDetailPage({ params }: PageProps) {
  const { designId } = await params;

  return <DesignDetailLoader designId={designId} />;
}
