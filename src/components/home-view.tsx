import { AboutSection } from "@/components/about-section"
import { HeroSection } from "@/components/hero-section"
import { HomeBlogSection } from "@/components/home-blog-section"
import { PricesSection } from "@/components/prices-section"
import { SiteFooter } from "@/components/site-footer"
import { StakesSection } from "@/components/stakes-section"
import { StepsSection } from "@/components/steps-section"
import { WorkSection } from "@/components/work-section"
import type { Home } from "@/type/home.type"
import type { Post } from "@/type/post.type"

export function HomeView({ home, posts }: { home: Home; posts: Post[] }) {
  return (
    <>
      <HeroSection home={home} />
      <StakesSection home={home} />
      <WorkSection />
      <StepsSection />
      <AboutSection />
      <HomeBlogSection posts={posts} />
      <PricesSection />
      <SiteFooter />
    </>
  )
}
