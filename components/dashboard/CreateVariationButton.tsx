"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createDesignVariation } from "@/lib/design-variations-store";
import type { SavedDesign } from "@/lib/saved-designs";

type CreateVariationButtonProps = {
  design: SavedDesign;
  className: string;
};

export function CreateVariationButton({ design, className }: CreateVariationButtonProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (creating) return;

    setCreating(true);
    await new Promise((resolve) => setTimeout(resolve, 350));

    const result = createDesignVariation(design);
    setCreating(false);

    if (!result.ok) {
      window.alert("Unable to create a variation for this design.");
      return;
    }

    router.push(`/dashboard/designs/${result.variation.id}`);
  };

  return (
    <button
      type="button"
      className={`${className} disabled:pointer-events-none disabled:opacity-70`}
      onClick={handleCreate}
      disabled={creating}
      aria-busy={creating}
    >
      {creating ? "Creating Variation…" : "Create Variation"}
    </button>
  );
}
