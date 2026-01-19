import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhySection from "@/components/WhySection";
import WhatSection from "@/components/WhatSection";
import HowSection from "@/components/HowSection";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <WhySection />
        <WhatSection />
        <HowSection />
        <ResultsSection />
      </main>
      <Footer />
    </div>
  );
}
