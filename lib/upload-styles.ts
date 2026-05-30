export const uploadStyleOptions = [
  { id: "modern", label: "Modern", description: "Clean lines, neutral palette, bold geometry" },
  { id: "luxury", label: "Luxury", description: "Rich materials, statement lighting, refined details" },
  { id: "coastal", label: "Coastal", description: "Airy tones, natural textures, relaxed elegance" },
  { id: "japandi", label: "Japandi", description: "Warm minimalism, organic forms, calm balance" },
  { id: "farmhouse", label: "Farmhouse", description: "Rustic warmth, shiplap, timeless comfort" },
  { id: "minimalist", label: "Minimalist", description: "Uncluttered space, soft contrast, quiet luxury" },
] as const;

export type UploadStyleId = (typeof uploadStyleOptions)[number]["id"];
