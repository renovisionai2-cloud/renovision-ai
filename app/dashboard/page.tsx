import type { Metadata } from "next";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { SavedDesignsCountLabel } from "@/components/dashboard/SavedDesignsCount";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";import { demoSavedDesigns } from "@/lib/saved-designs";
import {
  BillingIcon,
  DesignsIcon,
  PlanIcon,
  ProjectsIcon,
  SupportIcon,
  UploadRoomIcon,
} from "@/components/icons/DashboardIcons";
export const metadata: Metadata = {
  title: "Dashboard | RenoVision AI",
  description: "Manage your RenoVision AI projects, designs, and subscription.",
};

export default function DashboardPage() {
  return (
    <>
      <WelcomeSection />
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-2">
          <DashboardCard
            featured
            badge="Get started"
            title="Upload Room"
            description="Add a photo of your space and let RenoVision AI generate photorealistic interior designs in under 30 seconds."
            icon={<UploadRoomIcon />}
            actionLabel="Upload Photo"
            actionHref="/dashboard/upload"
            secondaryActionLabel="Use Sample Room"
            secondaryActionHref="/dashboard/upload?sample=1"
          />
        </div>

        <DashboardCard
          title="My Projects"
          description="View and manage all your room visualizations, comparisons, and client-ready exports."
          icon={<ProjectsIcon />}
          meta="2 active · 1 draft"
          actionLabel="View Projects"
          actionHref="/dashboard/projects"
        />

        <DashboardCard
          title="Saved Designs"
          description="Browse your favorite AI-generated styles, palettes, and before/after comparisons."
          icon={<DesignsIcon />}
          meta={<SavedDesignsCountLabel fallback={demoSavedDesigns.length} />}
          actionLabel="Open Gallery"
          actionHref="/dashboard/designs"
          secondaryActionLabel="Export All"
        />

        <DashboardCard
          title="Current Plan"
          description="You're on the Pro plan with unlimited visualizations and 4K exports."
          icon={<PlanIcon />}
          badge="Pro"
          meta="$79 / month · Renews Jun 22"
          actionLabel="Manage Plan"
          secondaryActionLabel="Compare Plans"
        />

        <DashboardCard
          title="Billing"
          description="Update payment method, download invoices, and review your billing history."
          icon={<BillingIcon />}
          meta="Visa ending in 4242"
          actionLabel="Payment Settings"
          actionHref="/dashboard/billing"
          secondaryActionLabel="View Invoices"
          secondaryActionHref="/dashboard/billing"
        />

        <div className="sm:col-span-2 lg:col-span-3">
          <DashboardCard
            title="Support"
            description="Get help from our design success team, browse guides, or open a priority support ticket."
            icon={<SupportIcon />}
            actionLabel="Contact Support"
            secondaryActionLabel="Help Center"
          />
        </div>
      </div>
    </>
  );
}