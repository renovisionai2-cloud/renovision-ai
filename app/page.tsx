import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AIFeatures } from "@/components/sections/AIFeatures";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContractorBenefits } from "@/components/sections/ContractorBenefits";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <AIFeatures />
        <ContractorBenefits />
        <Pricing />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
