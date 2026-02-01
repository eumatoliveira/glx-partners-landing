import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Check, Clock, Target, Zap, Shield, BarChart3, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export default function Plans() {
  const { t } = useLanguage();
  const [showVideoPartners, setShowVideoPartners] = useState(false);
  const [showVideoControlTower, setShowVideoControlTower] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container flex items-center justify-between h-16 md:h-20 px-4">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <img 
              src="/images/logo-transparent.png" 
              alt="GLX Partners" 
              className="h-12 md:h-20 w-auto" 
            />
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-primary gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.plans.backToSite}
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-6 block">
              {t.plans.ourPlans}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t.plans.mainTitle} <span className="text-primary">{t.plans.mainTitleHighlight}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.plans.mainSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* PLANO 1: GLX Partners */}
      <section className="py-16 md:py-24 px-4 border-t border-white/5">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {t.plans.partnersTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t.plans.partnersSubtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-lg p-8 md:p-12"
          >
            {/* Video Space */}
            <div 
              onClick={() => setShowVideoPartners(!showVideoPartners)}
              className="relative bg-black/50 rounded-lg aspect-video mb-10 cursor-pointer overflow-hidden group/video max-w-3xl mx-auto"
            >
              {showVideoPartners ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <p className="text-muted-foreground text-sm">{t.plans.videoComingSoon || "Vídeo em breve"}</p>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary/90 rounded-full p-5 group-hover/video:bg-primary transition-colors">
                      <Play className="h-10 w-10 text-white fill-white" />
                    </div>
                  </div>
                  <p className="absolute bottom-4 left-4 text-sm text-muted-foreground">{t.plans.videoPlaceholder}</p>
                </>
              )}
            </div>

            {/* Plan Phases */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {/* Diagnóstico */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{t.plans.diagTitle}</h3>
                    <span className="text-primary text-sm font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t.plans.diagDuration}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{t.plans.diagDesc}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{t.plans.diagFeature1}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{t.plans.diagFeature2}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{t.plans.diagFeature3}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{t.plans.diagFeature4}</span>
                  </li>
                </ul>
              </div>

              {/* Setup */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Setup</h3>
                    <span className="text-primary text-sm font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      60-90 {t.plans.diagDuration?.includes("dias") ? "dias" : "days"}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{t.plans.startDesc}</p>
                
                <div className="space-y-3">
                  <div className="bg-white/5 rounded p-3">
                    <p className="text-white text-sm font-semibold mb-1">{t.plans.startTitle} <span className="text-primary text-xs">({t.plans.startDuration})</span></p>
                    <ul className="space-y-1">
                      <li className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <span>{t.plans.startFeature1}</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <span>{t.plans.startFeature2}</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <span>{t.plans.startFeature3}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-primary/10 rounded p-3 border border-primary/30">
                    <p className="text-white text-sm font-semibold mb-1">{t.plans.proTitle} <span className="text-primary text-xs">({t.plans.proDuration})</span></p>
                    <ul className="space-y-1">
                      <li className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <span>{t.plans.proFeature1}</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <span>{t.plans.proFeature2}</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <span>{t.plans.proFeature3}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Gestão Contínua - DESTACADO */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-6 border-2 border-primary/50 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{t.plans.continuousTitle}</h3>
                    <span className="text-primary text-sm font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t.plans.continuousDuration}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{t.plans.continuousDesc}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{t.plans.continuousFeature1}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{t.plans.continuousFeature2}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{t.plans.continuousFeature3}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{t.plans.continuousFeature4}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{t.plans.continuousFeature5}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Button 
                onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider rounded-none px-12 py-6 text-lg" style={{paddingRight: '24px', paddingLeft: '24px', width: '250px'}}
              >
                {t.plans.requestProposal}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PLANO 2: GLX Control Tower */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-white/[0.02] to-transparent border-t border-white/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {t.plans.towerTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t.plans.towerSubtitle}
            </p>
          </motion.div>

          {/* Video Space for Control Tower */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onClick={() => setShowVideoControlTower(!showVideoControlTower)}
            className="relative bg-black/50 rounded-lg aspect-video mb-12 cursor-pointer overflow-hidden group/video max-w-3xl mx-auto"
          >
            {showVideoControlTower ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <p className="text-muted-foreground text-sm">{t.plans.videoComingSoon || "Vídeo em breve"}</p>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-primary/90 rounded-full p-5 group-hover/video:bg-primary transition-colors">
                    <Play className="h-10 w-10 text-white fill-white" />
                  </div>
                </div>
                <p className="absolute bottom-4 left-4 text-sm text-muted-foreground">{t.plans.videoPlaceholder}</p>
              </>
            )}
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Essentials */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0 }}
              className="bg-gradient-to-br from-blue-500/10 to-blue-500/0 border border-blue-500/30 hover:border-blue-500/60 rounded-lg p-6 md:p-8 transition-all duration-300"
            >
              <div className="inline-flex p-3 rounded-lg bg-blue-500/20 text-blue-400 mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">{t.plans.essentialsTitle}</h3>
              <p className="text-blue-400 text-sm font-semibold mb-4">{t.plans.essentialsTagline}</p>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t.plans.essentialsDesc}</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{t.plans.essentialsFeature1}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{t.plans.essentialsFeature2}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{t.plans.essentialsFeature3}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{t.plans.essentialsFeature4}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{t.plans.essentialsFeature5}</span>
                </li>
              </ul>

              <Button 
                onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider rounded-none"
              >
                {t.plans.requestProposal}
              </Button>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/50 hover:border-primary rounded-lg p-6 md:p-8 transition-all duration-300"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                {t.plans.recommended}
              </div>

              <div className="inline-flex p-3 rounded-lg bg-primary/20 text-primary mb-4">
                <Shield className="h-6 w-6" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">{t.plans.towerProTitle}</h3>
              <p className="text-primary text-sm font-semibold mb-4">{t.plans.towerProTagline}</p>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t.plans.towerProDesc}</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t.plans.towerProFeature1}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t.plans.towerProFeature2}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t.plans.towerProFeature3}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t.plans.towerProFeature4}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t.plans.towerProFeature5}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t.plans.towerProFeature6}</span>
                </li>
              </ul>

              <Button 
                onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
                className="w-full bg-primary hover:bg-primary/90 font-bold uppercase tracking-wider rounded-none"
              >
                {t.plans.requestProposal}
              </Button>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500/10 to-purple-500/0 border border-purple-500/30 hover:border-purple-500/60 rounded-lg p-6 md:p-8 transition-all duration-300"
            >
              <div className="inline-flex p-3 rounded-lg bg-purple-500/20 text-purple-400 mb-4">
                <Building2 className="h-6 w-6" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">{t.plans.enterpriseTitle}</h3>
              <p className="text-purple-400 text-sm font-semibold mb-4">{t.plans.enterpriseTagline}</p>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t.plans.enterpriseDesc}</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>{t.plans.enterpriseFeature1}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>{t.plans.enterpriseFeature2}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>{t.plans.enterpriseFeature3}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>{t.plans.enterpriseFeature4}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>{t.plans.enterpriseFeature5}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>{t.plans.enterpriseFeature6}</span>
                </li>
              </ul>

              <Button 
                onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider rounded-none"
              >
                {t.plans.requestProposal}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 border-t border-white/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t.plans.finalTitle}
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              {t.plans.finalSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider rounded-none px-8 py-6 text-lg"
              >
                {t.plans.finalCta}
              </Button>
              <Link href="/">
                <Button 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-wider rounded-none px-8 py-6 text-lg"
                >
                  {t.plans.finalSecondary}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="container text-center">
          <p className="text-muted-foreground text-sm">
            {t.plans.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}
