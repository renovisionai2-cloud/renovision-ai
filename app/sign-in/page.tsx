import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignInFooter, SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In | RenoVision AI",
  description: "Sign in to your RenoVision AI customer dashboard.",
};

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your projects, saved designs, and AI visualizations."
      footer={<SignInFooter />}
    >
      <SignInForm />
    </AuthShell>
  );
}
