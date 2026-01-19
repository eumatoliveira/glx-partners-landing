import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ImpactSection from "@/components/ImpactSection";
import WhySection from "@/components/WhySection";
import WhatSection from "@/components/WhatSection";
import HowSection from "@/components/HowSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ImpactSection />
        <WhySection />
        <WhatSection />
        <HowSection />
        <TestimonialsSection />
        <ResultsSection />
      </main>
      <Footer />
    </div>
  );
}
