import type { SavedDesign } from "@/lib/saved-designs";

function slugSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Example: living-room-modern-may-18-2026.jpg */
export function getDesignExportFilename(design: SavedDesign): string {
  const room = slugSegment(design.roomName);
  const style = slugSegment(design.styleName);
  const date = slugSegment(design.createdAt);
  return `${room}-${style}-${date}.jpg`;
}

/** Mock export: downloads the AFTER preview image as a JPEG file. */
export async function downloadDesignExport(design: SavedDesign): Promise<void> {
  const filename = getDesignExportFilename(design);
  const response = await fetch(design.afterImage);

  if (!response.ok) {
    throw new Error(`Failed to fetch export image (${response.status})`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
