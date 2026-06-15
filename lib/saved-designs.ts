export type DesignStatus = "Ready" | "Draft";

export type SavedDesign = {
  id: string;
  roomName: string;
  styleName: string;
  createdAt: string;
  beforeImage: string;
  afterImage: string;
  projectName: string;
  status: DesignStatus;
  /** Original design id when this row is a user-created variation. */
  baseDesignId?: string;
  version?: number;
};

export const designRecommendations =
  "This concept uses a modern palette with warm lighting, simplified furniture placement, and cleaner visual balance. Review finishes, lighting, and furniture scale before sharing with a client.";

export function getDesignTitle(design: SavedDesign): string {
  return `${design.roomName} — ${design.styleName}`;
}
