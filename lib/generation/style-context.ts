import { uploadStyleOptions, type UploadStyleId } from "@/lib/upload-styles";

export const STYLE_GENERATION_CONTEXT: Record<
  UploadStyleId,
  { roomName: string; projectName: string; styleLabel: string }
> = {
  modern: { roomName: "Living Room", projectName: "Main Floor Refresh", styleLabel: "Modern" },
  luxury: { roomName: "Kitchen", projectName: "Kitchen Concept", styleLabel: "Luxury" },
  coastal: { roomName: "Bedroom", projectName: "Bedroom Concept", styleLabel: "Coastal" },
  japandi: { roomName: "Basement", projectName: "Basement Remodel", styleLabel: "Japandi" },
  farmhouse: { roomName: "Basement", projectName: "Basement Remodel", styleLabel: "Farmhouse" },
  minimalist: { roomName: "Kitchen", projectName: "Kitchen Concept", styleLabel: "Minimalist" },
};

export function getStyleLabel(styleId: UploadStyleId): string {
  return uploadStyleOptions.find((option) => option.id === styleId)?.label ?? styleId;
}
