"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DESIGN_CATALOG_CHANGED_EVENT,
  getSavedDesignsCount,
} from "@/lib/design-variations-store";
import { PROJECT_DESIGN_SAVED_EVENT } from "@/lib/project-design-store";

type SavedDesignsCountProps = {
  fallback: number;
  className?: string;
  suffix?: string;
};

export function SavedDesignsCount({
  fallback,
  className,
  suffix = "",
}: SavedDesignsCountProps) {
  const [count, setCount] = useState(fallback);

  const refresh = useCallback(() => {
    setCount(getSavedDesignsCount());
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

  return (
    <span className={className}>
      {count}
      {suffix}
    </span>
  );
}

export function SavedDesignsCountLabel({ fallback }: { fallback: number }) {
  const [label, setLabel] = useState(() => formatLabel(fallback));

  const refresh = useCallback(() => {
    setLabel(formatLabel(getSavedDesignsCount()));
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

  return <>{label}</>;
}

function formatLabel(count: number): string {
  return `${count} saved design${count === 1 ? "" : "s"}`;
}
