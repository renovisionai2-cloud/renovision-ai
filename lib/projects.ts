export type ProjectStatus = "Active" | "Draft";

export type ProjectDefinition = {
  id: string;
  name: string;
  roomType: string;
};

export type Project = ProjectDefinition & {
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

export const PROJECT_CATALOG: ProjectDefinition[] = [
  {
    id: "main-floor-refresh",
    name: "Main Floor Refresh",
    roomType: "Living Room",
  },
  {
    id: "kitchen-concept",
    name: "Kitchen Concept",
    roomType: "Kitchen",
  },
  {
    id: "basement-remodel",
    name: "Basement Remodel",
    roomType: "Basement",
  },
  {
    id: "bedroom-concept",
    name: "Bedroom Concept",
    roomType: "Bedroom",
  },
];

export const PROJECT_NAME_TO_ID: Record<string, string> = {
  "Main Floor Refresh": "main-floor-refresh",
  "Kitchen Concept": "kitchen-concept",
  "Basement Remodel": "basement-remodel",
  "Bedroom Concept": "bedroom-concept",
};

export function getProjectDefinition(projectId: string): ProjectDefinition | undefined {
  return PROJECT_CATALOG.find((project) => project.id === projectId);
}

export function isKnownProjectId(projectId: string): boolean {
  return PROJECT_CATALOG.some((project) => project.id === projectId);
}

/** Server-safe project list for dashboard pages (counts filled client-side). */
export function listCatalogProjects(): Project[] {
  return PROJECT_CATALOG.map((definition) => ({
    ...definition,
    status: "Active" as const,
    lastUpdated: "—",
    designCount: 0,
  }));
}
