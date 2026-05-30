import type { Metadata } from "next";
import { DesignDetailLoader } from "@/components/dashboard/DesignDetailLoader";
import { allDesignDetails, getDesignById, getDesignTitle } from "@/lib/saved-designs";

type PageProps = {
  params: Promise<{ designId: string }>;
};

export function generateStaticParams() {
  return allDesignDetails.map((design) => ({ designId: design.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { designId } = await params;
  const design = getDesignById(designId);
  const title = design ? getDesignTitle(design) : "Design";
  return {
    title: `${title} | RenoVision AI`,
    description: "Before and after AI visualization preview.",
  };
}

export default async function DesignDetailPage({ params }: PageProps) {
  const { designId } = await params;
  const initialDesign = getDesignById(designId) ?? null;

  return <DesignDetailLoader designId={designId} initialDesign={initialDesign} />;
}
