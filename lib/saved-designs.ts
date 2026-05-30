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

export const demoSavedDesigns: SavedDesign[] = [
  {
    id: "living-room-modern",
    roomName: "Living Room",
    styleName: "Modern",
    createdAt: "May 18, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    projectName: "Main Floor Refresh",
    status: "Ready",
  },
  {
    id: "kitchen-luxury",
    roomName: "Kitchen",
    styleName: "Luxury",
    createdAt: "May 15, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    projectName: "Kitchen Concept",
    status: "Ready",
  },
  {
    id: "basement-japandi",
    roomName: "Basement",
    styleName: "Japandi",
    createdAt: "May 12, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    projectName: "Basement Remodel",
    status: "Ready",
  },
  {
    id: "bedroom-coastal",
    roomName: "Bedroom",
    styleName: "Coastal",
    createdAt: "May 8, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    projectName: "Bedroom Concept",
    status: "Ready",
  },
];

/** Detail routes linked from project pages; not shown on the Saved Designs gallery. */
export const additionalProjectDesigns: SavedDesign[] = [
  {
    id: "basement-modern",
    roomName: "Basement",
    styleName: "Modern",
    createdAt: "May 13, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    projectName: "Basement Remodel",
    status: "Ready",
  },
  {
    id: "basement-luxury",
    roomName: "Basement",
    styleName: "Luxury",
    createdAt: "May 10, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    projectName: "Basement Remodel",
    status: "Ready",
  },
  {
    id: "basement-coastal",
    roomName: "Basement",
    styleName: "Coastal",
    createdAt: "May 8, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    projectName: "Basement Remodel",
    status: "Ready",
  },
  {
    id: "living-room-coastal",
    roomName: "Living Room",
    styleName: "Coastal",
    createdAt: "May 17, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    projectName: "Main Floor Refresh",
    status: "Ready",
  },
  {
    id: "living-room-luxury",
    roomName: "Living Room",
    styleName: "Luxury",
    createdAt: "May 15, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    projectName: "Main Floor Refresh",
    status: "Ready",
  },
  {
    id: "kitchen-japandi",
    roomName: "Kitchen",
    styleName: "Japandi",
    createdAt: "May 16, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    projectName: "Kitchen Concept",
    status: "Ready",
  },
  {
    id: "kitchen-minimalist",
    roomName: "Kitchen",
    styleName: "Minimalist",
    createdAt: "May 14, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    projectName: "Kitchen Concept",
    status: "Ready",
  },
];

export const allDesignDetails: SavedDesign[] = [
  ...demoSavedDesigns,
  ...additionalProjectDesigns,
];

export function getDesignById(designId: string): SavedDesign | undefined {
  return allDesignDetails.find((design) => design.id === designId);
}

export function getDesignTitle(design: SavedDesign): string {
  return `${design.roomName} — ${design.styleName}`;
}
