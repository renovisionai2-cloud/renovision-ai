export type ProjectStatus = "Active" | "Draft";

export type DemoProject = {
  id: string;
  name: string;
  roomType: string;
  status: ProjectStatus;
  lastUpdated: string;
  designCount: number;
};

export type ProjectDesign = {
  id: string;
  projectId: string;
  styleName: string;
  createdAt: string;
  beforeImage: string;
  afterImage: string;
  /** Route slug for /dashboard/designs/[designId] */
  savedDesignId: string;
};

export const demoProjects: DemoProject[] = [
  {
    id: "main-floor-refresh",
    name: "Main Floor Refresh",
    roomType: "Living Room",
    status: "Active",
    lastUpdated: "May 20, 2026",
    designCount: 3,
  },
  {
    id: "kitchen-concept",
    name: "Kitchen Concept",
    roomType: "Kitchen",
    status: "Draft",
    lastUpdated: "May 17, 2026",
    designCount: 2,
  },
  {
    id: "basement-remodel",
    name: "Basement Remodel",
    roomType: "Basement",
    status: "Active",
    lastUpdated: "May 14, 2026",
    designCount: 4,
  },
  {
    id: "bedroom-concept",
    name: "Bedroom Concept",
    roomType: "Bedroom",
    status: "Draft",
    lastUpdated: "May 8, 2026",
    designCount: 0,
  },
];

export const demoProjectDesigns: ProjectDesign[] = [
  {
    id: "mfr-modern",
    projectId: "main-floor-refresh",
    styleName: "Modern",
    createdAt: "May 18, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    savedDesignId: "living-room-modern",
  },
  {
    id: "mfr-coastal",
    projectId: "main-floor-refresh",
    styleName: "Coastal",
    createdAt: "May 17, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    savedDesignId: "living-room-coastal",
  },
  {
    id: "mfr-luxury",
    projectId: "main-floor-refresh",
    styleName: "Luxury",
    createdAt: "May 15, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    savedDesignId: "living-room-luxury",
  },
  {
    id: "kc-japandi",
    projectId: "kitchen-concept",
    styleName: "Japandi",
    createdAt: "May 16, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    savedDesignId: "kitchen-japandi",
  },
  {
    id: "kc-minimalist",
    projectId: "kitchen-concept",
    styleName: "Minimalist",
    createdAt: "May 14, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    savedDesignId: "kitchen-minimalist",
  },
  {
    id: "br-modern",
    projectId: "basement-remodel",
    styleName: "Modern",
    createdAt: "May 13, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    savedDesignId: "basement-modern",
  },
  {
    id: "br-japandi",
    projectId: "basement-remodel",
    styleName: "Japandi",
    createdAt: "May 12, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    savedDesignId: "basement-japandi",
  },
  {
    id: "br-luxury",
    projectId: "basement-remodel",
    styleName: "Luxury",
    createdAt: "May 10, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    savedDesignId: "basement-luxury",
  },
  {
    id: "br-coastal",
    projectId: "basement-remodel",
    styleName: "Coastal",
    createdAt: "May 8, 2026",
    beforeImage: "/demo/before.jpg",
    afterImage: "/demo/after.jpg",
    savedDesignId: "basement-coastal",
  },
];

export function getProjectById(projectId: string): DemoProject | undefined {
  return demoProjects.find((p) => p.id === projectId);
}

export function getDesignsForProject(projectId: string): ProjectDesign[] {
  return demoProjectDesigns.filter((d) => d.projectId === projectId);
}
