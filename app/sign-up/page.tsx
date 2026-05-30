import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpFooter, SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up | RenoVision AI",
  description: "Create your RenoVision AI account and start visualizing your space.",
};

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create account"
      subtitle="Join RenoVision AI and see your space reimagined in minutes."
      footer={<SignUpFooter />}
    >
      <SignUpForm />
    </AuthShell>
  );
}
