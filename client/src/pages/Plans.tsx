import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Check, Clock, Target, Zap, Shield, BarChart3, Settings, Users, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface PlanCardProps {
  title: string;
  duration?: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  videoPlaceholder?: boolean;
  highlighted?: boolean;
  highlightLabel?: string;
  ctaText: string;
  videoText?: string;
  delay?: number;
}

function PlanCard({ title, duration, description, features, icon, videoPlaceholder, highlighted, highlightLabel, ctaText, videoText, delay = 0 }: PlanCardProps) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`relative bg-gradient-to-br ${highlighted ? 'from-primary/20 to-primary/5 border-primary/50' : 'from-white/5 to-white/0 border-white/10'} border rounded-lg p-6 md:p-8 hover:border-primary/50 transition-all duration-300 group`}
    >
      {highlighted && highlightLabel && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
          {highlightLabel}
        </div>
      )}
      
      <div className="flex items-start gap-4 mb-6">
        <div className={`p-3 rounded-lg ${highlighted ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white'} group-hover:bg-primary/20 group-hover:text-primary transition-colors`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{title}</h3>
          {duration && (
            <span className="text-primary text-sm font-semibold flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {duration}
            </span>
          )}
        </div>
      </div>

      <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>

      {/* Espaço para Vídeo */}
      {videoPlaceholder && (
        <div 
          onClick={() => setShowVideo(!showVideo)}
          className="relative bg-black/50 rounded-lg aspect-video mb-6 cursor-pointer overflow-hidden group/video"
        >
          {showVideo ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <p className="text-muted-foreground text-sm">Vídeo em breve</p>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary/90 rounded-full p-4 group-hover/video:bg-primary transition-colors">
                  <Play className="h-8 w-8 text-white fill-white" />
                </div>
              </div>
              <p className="absolute bottom-3 left-3 text-xs text-muted-foreground">{videoText}</p>
            </>
          )}
        </div>
      )}

      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
        className={`w-full mt-8 ${highlighted ? 'bg-primary hover:bg-primary/90' : 'bg-white/10 hover:bg-white/20 text-white'} font-bold uppercase tracking-wider rounded-none`}
      >
        {ctaText}
      </Button>
    </motion.div>
  );
}

interface TierCardProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  tier: 'essentials' | 'pro' | 'enterprise';
  recommendedLabel?: string;
  ctaText: string;
  delay?: number;
}

function TierCard({ title, subtitle, description, features, icon, tier, recommendedLabel, ctaText, delay = 0 }: TierCardProps) {
  const tierStyles = {
    essentials: 'from-blue-500/10 to-blue-500/0 border-blue-500/30 hover:border-blue-500/60',
    pro: 'from-primary/20 to-primary/5 border-primary/50 hover:border-primary',
    enterprise: 'from-purple-500/10 to-purple-500/0 border-purple-500/30 hover:border-purple-500/60'
  };

  const iconStyles = {
    essentials: 'bg-blue-500/20 text-blue-400',
    pro: 'bg-primary/20 text-primary',
    enterprise: 'bg-purple-500/20 text-purple-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`relative bg-gradient-to-br ${tierStyles[tier]} border rounded-lg p-6 md:p-8 transition-all duration-300`}
    >
      {tier === 'pro' && recommendedLabel && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
          {recommendedLabel}
        </div>
      )}

      <div className={`inline-flex p-3 rounded-lg ${iconStyles[tier]} mb-4`}>
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
      <p className="text-primary text-sm font-semibold mb-4">{subtitle}</p>
      <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
        className={`w-full ${tier === 'pro' ? 'bg-primary hover:bg-primary/90' : 'bg-white/10 hover:bg-white/20 text-white'} font-bold uppercase tracking-wider rounded-none`}
      >
        {ctaText}
      </Button>
    </motion.div>
  );
}

export default function Plans() {
  const { t } = useLanguage();

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
              {t.plans.mainSubtitle} {t.plans.mainDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* GLX Partners Section */}
      <section className="py-16 md:py-24 px-4 border-t border-white/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              GLX <span className="text-primary">Partners</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.plans.partnersSubtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PlanCard
              title={t.plans.diagTitle}
              duration={t.plans.diagDuration}
              description={t.plans.diagDesc}
              features={[
                t.plans.diagFeature1,
                t.plans.diagFeature2,
                t.plans.diagFeature3,
                t.plans.diagFeature4
              ]}
              icon={<Target className="h-6 w-6" />}
              videoPlaceholder
              ctaText={t.plans.scheduleCall}
              videoText={t.plans.videoPlaceholder}
              delay={0}
            />

            <PlanCard
              title={t.plans.startTitle}
              duration={t.plans.startDuration}
              description={t.plans.startDesc}
              features={[
                t.plans.startFeature1,
                t.plans.startFeature2,
                t.plans.startFeature3
              ]}
              icon={<Zap className="h-6 w-6" />}
              videoPlaceholder
              ctaText={t.plans.scheduleCall}
              videoText={t.plans.videoPlaceholder}
              delay={0.1}
            />

            <PlanCard
              title={t.plans.proTitle}
              duration={t.plans.proDuration}
              description={t.plans.proDesc}
              features={[
                t.plans.proFeature1,
                t.plans.proFeature2,
                t.plans.proFeature3
              ]}
              icon={<Shield className="h-6 w-6" />}
              videoPlaceholder
              highlighted
              highlightLabel={t.plans.mostPopular}
              ctaText={t.plans.scheduleCall}
              videoText={t.plans.videoPlaceholder}
              delay={0.2}
            />

            <PlanCard
              title={t.plans.continuousTitle}
              duration={t.plans.continuousDuration}
              description={t.plans.continuousDesc}
              features={[
                t.plans.continuousFeature1,
                t.plans.continuousFeature2,
                t.plans.continuousFeature3,
                t.plans.continuousFeature4,
                t.plans.continuousFeature5
              ]}
              icon={<BarChart3 className="h-6 w-6" />}
              videoPlaceholder
              ctaText={t.plans.scheduleCall}
              videoText={t.plans.videoPlaceholder}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* GLX Control Tower Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-white/[0.02] to-transparent border-t border-white/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              GLX <span className="text-primary">Control Tower</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.plans.towerSubtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            <PlanCard
              title={t.plans.towerSetupTitle}
              duration={t.plans.towerSetupDuration}
              description={t.plans.towerSetupDesc}
              features={[
                t.plans.towerSetupFeature1,
                t.plans.towerSetupFeature2,
                t.plans.towerSetupFeature3
              ]}
              icon={<Settings className="h-6 w-6" />}
              videoPlaceholder
              ctaText={t.plans.scheduleCall}
              videoText={t.plans.videoPlaceholder}
              delay={0}
            />

            <PlanCard
              title={t.plans.towerContinuousTitle}
              duration={t.plans.towerContinuousDuration}
              description={t.plans.towerContinuousDesc}
              features={[
                t.plans.towerContinuousFeature1,
                t.plans.towerContinuousFeature2,
                t.plans.towerContinuousFeature3
              ]}
              icon={<BarChart3 className="h-6 w-6" />}
              videoPlaceholder
              ctaText={t.plans.scheduleCall}
              videoText={t.plans.videoPlaceholder}
              delay={0.1}
            />
          </div>

          {/* Control Tower Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t.plans.towerPlansTitle}
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t.plans.towerPlansSubtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <TierCard
              title={t.plans.essentialsTitle}
              subtitle={t.plans.essentialsTagline}
              description={t.plans.essentialsDesc}
              features={[
                t.plans.essentialsFeature1,
                t.plans.essentialsFeature2,
                t.plans.essentialsFeature3,
                t.plans.essentialsFeature4,
                t.plans.essentialsFeature5
              ]}
              icon={<BarChart3 className="h-6 w-6" />}
              tier="essentials"
              ctaText={t.plans.requestProposal}
              delay={0}
            />

            <TierCard
              title={t.plans.towerProTitle}
              subtitle={t.plans.towerProTagline}
              description={t.plans.towerProDesc}
              features={[
                t.plans.towerProFeature1,
                t.plans.towerProFeature2,
                t.plans.towerProFeature3,
                t.plans.towerProFeature4,
                t.plans.towerProFeature5,
                t.plans.towerProFeature6
              ]}
              icon={<Shield className="h-6 w-6" />}
              tier="pro"
              recommendedLabel={t.plans.recommended}
              ctaText={t.plans.requestProposal}
              delay={0.1}
            />

            <TierCard
              title={t.plans.enterpriseTitle}
              subtitle={t.plans.enterpriseTagline}
              description={t.plans.enterpriseDesc}
              features={[
                t.plans.enterpriseFeature1,
                t.plans.enterpriseFeature2,
                t.plans.enterpriseFeature3,
                t.plans.enterpriseFeature4,
                t.plans.enterpriseFeature5,
                t.plans.enterpriseFeature6
              ]}
              icon={<Building2 className="h-6 w-6" />}
              tier="enterprise"
              ctaText={t.plans.requestProposal}
              delay={0.2}
            />
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
