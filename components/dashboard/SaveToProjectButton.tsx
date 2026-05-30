"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isDesignSavedToLinkedProject,
  saveDesignToProject,
} from "@/lib/project-design-store";
import type { SavedDesign } from "@/lib/saved-designs";

type SaveToProjectButtonProps = {
  design: SavedDesign;
  className: string;
};

export function SaveToProjectButton({ design, className }: SaveToProjectButtonProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const refreshSavedState = useCallback(() => {
    setSaved(isDesignSavedToLinkedProject(design));
  }, [design]);

  useEffect(() => {
    refreshSavedState();
  }, [refreshSavedState]);

  const handleSave = () => {
    if (saved || saving) return;

    setSaving(true);
    const result = saveDesignToProject(design);
    setSaving(false);

    if (result === "saved" || result === "already_saved") {
      setSaved(true);
    } else {
      window.alert("Unable to save this design to its project.");
    }
  };

  const successClass = saved ? "border-gold/40 bg-gold/10 text-gold-light" : "";

  return (
    <button
      type="button"
      className={`${className} ${successClass} disabled:pointer-events-none disabled:opacity-70`}
      onClick={handleSave}
      disabled={saved || saving}
      aria-pressed={saved}
    >
      {saving ? "Saving..." : saved ? "Saved" : "Save to Project"}
    </button>
  );
}
