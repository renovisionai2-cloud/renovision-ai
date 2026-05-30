"use client";

import { useCallback, useEffect, useState } from "react";
import { SavedDesignsGallery } from "@/components/dashboard/SavedDesignsGallery";
import {
  DESIGN_CATALOG_CHANGED_EVENT,
  getGalleryDesigns,
} from "@/lib/design-variations-store";
import { demoSavedDesigns, type SavedDesign } from "@/lib/saved-designs";
import { PROJECT_DESIGN_SAVED_EVENT } from "@/lib/project-design-store";

export function SavedDesignsGalleryClient() {
  const [designs, setDesigns] = useState<SavedDesign[]>(demoSavedDesigns);

  const refresh = useCallback(() => {
    setDesigns(getGalleryDesigns());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onChange = () => refresh();
    window.addEventListener(DESIGN_CATALOG_CHANGED_EVENT, onChange);
    window.addEventListener(PROJECT_DESIGN_SAVED_EVENT, onChange);
    return () => {
      window.removeEventListener(DESIGN_CATALOG_CHANGED_EVENT, onChange);
      window.removeEventListener(PROJECT_DESIGN_SAVED_EVENT, onChange);
    };
  }, [refresh]);

  return <SavedDesignsGallery designs={designs} />;
}
