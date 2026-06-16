import "server-only";

import type { UploadStyleId } from "@/lib/upload-styles";
import { getStyleLabel } from "@/lib/generation/style-context";

const STYLE_PROMPT_FRAGMENTS: Record<UploadStyleId, string> = {
  modern:
    "modern interior design with clean lines, neutral palette, contemporary furniture, minimal clutter, and balanced natural lighting",
  luxury:
    "luxury interior design with rich materials, statement lighting, refined finishes, layered textures, and an upscale atmosphere",
  coastal:
    "coastal interior design with airy tones, natural textures, soft whites and blues, relaxed elegance, and abundant natural light",
  japandi:
    "japandi interior design with warm minimalism, organic forms, muted earthy tones, calm balance, and handcrafted simplicity",
  farmhouse:
    "farmhouse interior design with rustic warmth, natural wood, timeless comfort, soft textiles, and inviting lived-in character",
  minimalist:
    "minimalist interior design with uncluttered space, soft contrast, quiet luxury, restrained palette, and intentional simplicity",
};

/** Room Identity Lock — highest priority; overrides all redesign instructions. */
export const MODERN_ROOM_IDENTITY_LOCK = [
  "ROOM IDENTITY LOCK — HIGHEST PRIORITY: The room function is sacred and must never change.",
  "This rule has higher priority than all redesign instructions.",
  "If the image is a dining room: it must remain a dining room; it must contain a dining table and dining chairs; it must never become a living room.",
  "If the image is a living room: it must remain a living room; it must never become a dining room.",
  "If the image is a kitchen: it must remain a kitchen; it must retain kitchen cabinetry, countertops, and appliances.",
  "If the image is a bedroom: it must remain a bedroom; it must retain a bed.",
  "If the image is a bathroom: it must remain a bathroom.",
].join(" ");

/** Hard geometry lock — structure only, never styling. */
const MODERN_GEOMETRY_PRESERVE = [
  "PRESERVE EXACTLY: wall positions, window locations and sizes, door openings, ceiling shape and height, floor plan, room proportions, and camera angle.",
  "Do NOT add, remove, or move walls, windows, or doors.",
  "Do NOT change room layout, ceiling structure, or camera perspective.",
  "Do NOT generate outdoor scenes, streets, bridges, cities, landscapes, or fantasy environments.",
].join(" ");

/** Hard rule — never reuse or subtly improve existing pieces. */
const MODERN_NO_REUSE_FURNITURE = [
  "DO NOT REUSE EXISTING FURNITURE.",
  "If sofas, tables, chairs, rugs, lighting fixtures, or decor already exist, replace them with entirely new designer pieces.",
  "Never subtly improve existing furniture.",
  "Always install new furniture.",
].join(" ");

/** Aggressive redesign mandate for Renovation and Luxury tiers. */
const MODERN_REDESIGN_MANDATE = [
  "AGGRESSIVELY REDESIGN: completely replace wall finishes, textiles, decor and furnishings.",
  "Completely replace all furniture, rugs, lighting fixtures, artwork, decor, curtains, coffee tables, tabletop styling, textures, and material treatments.",
  "Remove all clutter and temporary objects.",
  "You are creating a new interior design, not polishing an existing room.",
  MODERN_NO_REUSE_FURNITURE,
].join(" ");

/** WOW factor for Renovation and Luxury tiers. */
const MODERN_WOW_FACTOR = [
  "The final image must create an emotional reaction similar to seeing a professionally staged luxury real-estate listing or an interior design magazine.",
  "The room should feel aspirational, elegant, expensive, and highly shareable.",
  "Avoid producing a room that merely looks cleaner or brighter.",
].join(" ");

/** Variant 1 — Modern Refresh: light improvements, keep most existing furniture. */
export const MODERN_REFRESH_PROMPT = [
  MODERN_ROOM_IDENTITY_LOCK,
  "Transform this exact room into a refreshed modern interior.",
  MODERN_GEOMETRY_PRESERVE,
  "Apply light modern improvements: declutter, refine styling, upgrade textiles, refresh decor accents, improve lighting warmth, and polish surfaces.",
  "Keep most existing furniture pieces and general layout, but make the room feel cleaner, brighter, and more intentional.",
  "Target a subtle 10-15% perceived value lift — polished and inviting, not fully renovated.",
].join(" ");

/** Variant 2 — Modern Renovation: significant full redesign. */
export const MODERN_RENOVATION_PROMPT = [
  MODERN_ROOM_IDENTITY_LOCK,
  "Transform this exact room into a significantly renovated modern interior.",
  MODERN_GEOMETRY_PRESERVE,
  MODERN_REDESIGN_MANDATE,
  "Specify entirely new furniture, new lighting fixtures, new artwork, new decor, new curtains, new rugs, completely replaced wall finishes, and updated textures throughout.",
  "The result must look like a real renovation — not a cleanup or light refresh.",
  "Target a professionally staged home worth 20-25% more.",
  MODERN_WOW_FACTOR,
  MODERN_ROOM_IDENTITY_LOCK,
].join(" ");

/** Variant 3 — Luxury Transformation: magazine-quality renovation. */
export const MODERN_LUXURY_TRANSFORMATION_PROMPT = [
  MODERN_ROOM_IDENTITY_LOCK,
  "Transform this exact room into a magazine-quality luxury modern renovation.",
  MODERN_GEOMETRY_PRESERVE,
  MODERN_REDESIGN_MANDATE,
  "Specify editorial-grade staging: high-end designer furniture, premium materials, sculptural designer lighting, curated gallery artwork, luxury textiles, feature wall treatments, rich layered textures, and sophisticated finishes.",
  "The room must feel worth 25-30% more — aspirational and photorealistic like Architectural Digest or a luxury real-estate listing.",
  "Never output a lightly edited version of the original room.",
  MODERN_WOW_FACTOR,
  MODERN_ROOM_IDENTITY_LOCK,
].join(" ");

/**
 * Signature Renovation (DEFAULT) — 70% Modern Renovation + 30% Luxury Transformation.
 * Professional redesign with selective luxury accents; avoids magazine excess.
 */
export const SIGNATURE_RENOVATION_PROMPT = [
  MODERN_ROOM_IDENTITY_LOCK,
  "Transform this exact room into a signature modern renovation — a professionally designed home that feels 20-25% more valuable.",
  MODERN_GEOMETRY_PRESERVE,
  MODERN_REDESIGN_MANDATE,
  "Completely replace all furniture, rugs, lighting fixtures, artwork, decor, curtains, textures, and wall finishes with new designer modern pieces.",
  "Blend confident renovation with selective luxury: add exactly one statement piece, one feature wall, premium textiles, and layered lighting.",
  "Use high-quality materials and refined staging, but avoid magazine-level excess or over-the-top editorial styling.",
  "The result must look like a real professional renovation — never a cleanup, declutter, or light refresh.",
  "The homeowner should think: WOW, I want my house to look like this.",
  MODERN_ROOM_IDENTITY_LOCK,
].join(" ");

export type ModernPromptVariant = "refresh" | "renovation" | "signature" | "luxury";

const MODERN_VARIANT_PROMPTS: Record<ModernPromptVariant, string> = {
  refresh: MODERN_REFRESH_PROMPT,
  renovation: MODERN_RENOVATION_PROMPT,
  signature: SIGNATURE_RENOVATION_PROMPT,
  luxury: MODERN_LUXURY_TRANSFORMATION_PROMPT,
};

/** Returns a Modern prompt variant. Defaults to signature (production). */
export function buildModernRenderPrompt(variant: ModernPromptVariant = "signature"): string {
  return MODERN_VARIANT_PROMPTS[variant];
}

/** Builds the provider-facing prompt for a selected upload style. */
export function buildStyleRenderPrompt(styleId: UploadStyleId): string {
  if (styleId === "modern") {
    return SIGNATURE_RENOVATION_PROMPT;
  }

  const label = getStyleLabel(styleId);
  const fragment = STYLE_PROMPT_FRAGMENTS[styleId];

  return [
    `Redesign this exact room into a realistic ${label} interior design.`,
    fragment,
    "Keep the SAME room structure, walls, windows, floor, ceiling, and camera angle.",
    "Only change furniture, finishes, lighting, decor, cabinetry, colors, and materials.",
    "Do NOT generate outdoor scenes, streets, bridges, cities, landscapes, or fantasy environments.",
    "Preserve the original architecture and room proportions exactly.",
    "Create a highly realistic luxury interior rendering.",
  ].join(" ");
}
