"use client";

import { useState } from "react";
import { downloadDesignExport } from "@/lib/export-design";
import type { SavedDesign } from "@/lib/saved-designs";

type ExportDesignButtonProps = {
  design: SavedDesign;
  className: string;
};

export function ExportDesignButton({ design, className }: ExportDesignButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (exporting) return;

    setExporting(true);
    try {
      await downloadDesignExport(design);
    } catch {
      window.alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      type="button"
      className={`${className} disabled:pointer-events-none disabled:opacity-70`}
      onClick={handleExport}
      disabled={exporting}
      aria-busy={exporting}
    >
      {exporting ? "Exporting..." : "Export Design"}
    </button>
  );
}
