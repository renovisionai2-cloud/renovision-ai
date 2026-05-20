export const navLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#contractors", label: "Contractors" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#contact", label: "Request Demo" },
] as const;

export const howItWorksSteps = [
  {
    step: "01",
    title: "Upload your room",
    description:
      "Snap a photo or upload an existing image. RenoVision AI analyzes layout, lighting, and proportions instantly.",
    icon: "upload",
  },
  {
    step: "02",
    title: "Choose your style",
    description:
      "Select from curated luxury palettes — Modern, Coastal, Japandi, Art Deco, and more.",
    icon: "palette",
  },
  {
    step: "03",
    title: "Generate & compare",
    description:
      "Receive photorealistic renders in under 30 seconds. Drag the slider to compare before and after.",
    icon: "compare",
  },
  {
    step: "04",
    title: "Share with confidence",
    description:
      "Export HD visuals for clients, contractors, or your renovation team — no guesswork required.",
    icon: "share",
  },
] as const;

export const aiFeatures = [
  {
    title: "Photorealistic Redesign",
    description:
      "AI preserves architecture while transforming finishes, furniture, and lighting with magazine-quality realism.",
    icon: "sparkles",
    tag: "Core",
  },
  {
    title: "Interactive Before / After",
    description:
      "Premium comparison sliders let clients experience transformations — the centerpiece of every pitch.",
    icon: "compare",
    tag: "Popular",
  },
  {
    title: "Material & Finish Swap",
    description:
      "Test flooring, cabinetry, wall colors, and fixtures virtually before committing to costly changes.",
    icon: "palette",
    tag: "Pro",
  },
  {
    title: "Virtual Staging",
    description:
      "Stage empty rooms for listings with designer-curated furniture sets tailored to your market.",
    icon: "home",
    tag: "Pro",
  },
  {
    title: "Style Variations",
    description:
      "Generate multiple design directions from a single photo — perfect for client presentations.",
    icon: "layers",
    tag: "Studio",
  },
  {
    title: "Client-Ready Exports",
    description:
      "4K exports, print-ready PDFs, and shareable links that elevate your professional deliverables.",
    icon: "export",
    tag: "Studio",
  },
] as const;

export const contractorBenefits = [
  {
    title: "Close deals faster",
    description:
      "Show homeowners exactly what they're buying. Visual proof reduces hesitation and accelerates sign-offs.",
    stat: "2.4×",
    statLabel: "faster approvals",
  },
  {
    title: "Fewer change orders",
    description:
      "Align on finishes before demolition. Clients see the outcome — fewer surprises mid-project.",
    stat: "38%",
    statLabel: "fewer revisions",
  },
  {
    title: "Premium positioning",
    description:
      "Stand out from competitors with cinematic visualizations that signal craftsmanship and care.",
    stat: "4.9★",
    statLabel: "client satisfaction",
  },
  {
    title: "Team collaboration",
    description:
      "Share visualizations with subs, designers, and clients. Everyone works from the same vision.",
    stat: "5",
    statLabel: "team seats on Studio",
  },
] as const;

export const pricingPlans = [
  {
    name: "Starter",
    price: 29,
    period: "month",
    description: "For homeowners exploring one room at a time.",
    features: [
      "10 AI visualizations / month",
      "3 design styles",
      "HD exports",
      "Email support",
    ],
    highlighted: false,
    cta: "Start Free Trial",
  },
  {
    name: "Pro",
    price: 79,
    period: "month",
    description: "For designers and small renovation projects.",
    features: [
      "Unlimited visualizations",
      "12+ premium styles",
      "4K exports & print-ready",
      "Material swap toolkit",
      "Priority support",
    ],
    highlighted: true,
    cta: "Get Pro",
  },
  {
    name: "Studio",
    price: 199,
    period: "month",
    description: "For contractors, agents, and design firms.",
    features: [
      "Everything in Pro",
      "Team seats (up to 5)",
      "White-label client reports",
      "API access",
      "Dedicated success manager",
    ],
    highlighted: false,
    cta: "Request Demo",
  },
] as const;

export const testimonials = [
  {
    quote:
      "We sold our listing 12 days faster after staging the living room with RenoVision AI. Buyers could finally see the potential.",
    author: "Sarah Chen",
    role: "Luxury Real Estate Agent",
    location: "San Francisco, CA",
    rating: 5,
  },
  {
    quote:
      "I avoided a $15K flooring mistake. RenoVision AI showed me exactly how dark oak would feel in our north-facing kitchen.",
    author: "Marcus Webb",
    role: "Homeowner",
    location: "Austin, TX",
    rating: 5,
  },
  {
    quote:
      "My clients approve concepts in one meeting now. The before/after slider is the centerpiece of every presentation.",
    author: "Elena Vasquez",
    role: "General Contractor",
    location: "Miami, FL",
    rating: 5,
  },
] as const;

export const beforeAfterImages = {
  before: {
    src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=85",
    alt: "Living room before renovation",
  },
  after: {
    src: "https://images.unsplash.com/photo-1618221195710-9f1323a874ca?w=1400&q=85",
    alt: "Living room after RenoVision AI renovation visualization",
  },
} as const;
