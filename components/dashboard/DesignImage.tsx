"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getDesignImageBlobUrl } from "@/lib/design-image-store";
import { getGeneratedDesignById } from "@/lib/generated-designs-store";
import type { SavedDesign } from "@/lib/saved-designs";

type DesignImageProps = {
  design: SavedDesign;
  variant: "before" | "after";
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
};

export function DesignImage({
  design,
  variant,
  alt,
  className,
  sizes,
  priority,
  fill = true,
}: DesignImageProps) {
  const fallback = variant === "before" ? design.beforeImage : design.afterImage;
  const [src, setSrc] = useState(fallback);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    void (async () => {
      const generated = getGeneratedDesignById(design.id);
      const storageKey =
        variant === "before" ? generated?.beforeStorageKey : generated?.afterStorageKey;

      if (!storageKey) {
        setSrc(variant === "before" ? design.beforeImage : design.afterImage);
        return;
      }

      const url = await getDesignImageBlobUrl(storageKey);
      if (cancelled) return;
      if (url) {
        objectUrl = url;
        setSrc(url);
      } else {
        setSrc(variant === "before" ? design.beforeImage : design.afterImage);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl?.startsWith("blob:")) URL.revokeObjectURL(objectUrl);
    };
  }, [design, variant]);

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={src.startsWith("blob:")}
    />
  );
}
