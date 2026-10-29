import { AboutSection } from "@/components/about-section"
import { HeroSection } from "@/components/hero-section"
import { PricesSection } from "@/components/prices-section"
import { SiteFooter } from "@/components/site-footer"
import { StakesSection } from "@/components/stakes-section"
import { StepsSection } from "@/components/steps-section"
import { WorkSection } from "@/components/work-section"
import type { Home } from "@/type/home.type"

export function HomeView({ home }: { home: Home }) {
  return (
    <>
      <HeroSection home={home} />
      <StakesSection home={home} />
      <WorkSection />
      <StepsSection />
      <AboutSection />
      <PricesSection />
      <SiteFooter />
    </>
  )
}
