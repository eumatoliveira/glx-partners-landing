import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ImpactSection from "@/components/ImpactSection";
import WhySection from "@/components/WhySection";
import WhatSection from "@/components/WhatSection";
import InsightsSection from "@/components/InsightsSection";
import HowSection from "@/components/HowSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import ResultsSection from "@/components/ResultsSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      <Navbar />
      <main className="relative flex-grow overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-[-8%] top-[12rem] h-[26rem] w-[26rem] rounded-full bg-orange-400/10 blur-[130px]" />
          <div className="absolute right-[-10%] top-[45rem] h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-[120px]" />
          <div className="absolute left-[25%] top-[98rem] h-[20rem] w-[20rem] rounded-full bg-white/8 blur-[110px]" />
        </div>
        <div className="relative z-10">
          <Hero />
          <ImpactSection />
          <WhySection />
          <WhatSection />
          <InsightsSection />
          <HowSection />
          <TestimonialsSection />
          <FaqSection />
          <ResultsSection />
          <ContactForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
