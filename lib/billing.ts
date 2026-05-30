export type DemoInvoice = {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending";
};

export const currentPlan = {
  name: "Pro",
  price: "$79",
  period: "month",
  renewalDate: "June 22, 2026",
  status: "Active" as const,
};

export const usageStats = [
  {
    label: "AI renders remaining",
    value: 8,
    displayValue: "8",
    max: null as number | null,
    hint: "Unlimited on Pro",
  },
  {
    label: "Saved designs",
    value: 12,
    displayValue: "12",
    max: null,
    hint: "No limit on Pro",
  },
  {
    label: "Active projects",
    value: 3,
    displayValue: "3",
    max: 10,
    hint: "10 included on Pro",
  },
] as const;

export const paymentMethod = {
  brand: "Visa",
  last4: "4242",
  expiry: "09/28",
};

export const demoInvoices: DemoInvoice[] = [
  { id: "inv-may-2026", date: "May 22, 2026", amount: "$79", status: "Paid" },
  { id: "inv-apr-2026", date: "April 22, 2026", amount: "$79", status: "Paid" },
  { id: "inv-mar-2026", date: "March 22, 2026", amount: "$79", status: "Paid" },
];

export const planComparison = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    description: "For homeowners exploring one room at a time.",
    current: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 79,
    description: "Unlimited visualizations and premium exports.",
    current: true,
  },
  {
    id: "contractor",
    name: "Contractor",
    price: 199,
    description: "Teams, white-label reports, and API access.",
    current: false,
  },
] as const;
