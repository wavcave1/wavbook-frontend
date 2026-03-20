import { BrowseCtaSection } from "@/components/home/browse-cta-section";
import { FeaturedStudiosSection } from "@/components/home/featured-studios-section";
import { HomeHeroSection } from "@/components/home/home-hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { StudioOwnersSection } from "@/components/home/studio-owners-section";
import { TestimonialsPlaceholderSection } from "@/components/home/testimonials-placeholder-section";
import { getHomepageLandingData } from "@/features/public/homepage.adapter";

export default async function HomePage() {
  const home = await getHomepageLandingData();

  return (
    <>
      <HomeHeroSection
        publishedStudioCount={home.publishedStudioCount}
        featuredStudioCount={home.featuredStudios.length}
      />
      <BrowseCtaSection locations={home.locations} />
      <FeaturedStudiosSection
        studios={home.featuredStudios}
        source={home.featuredSource}
      />
      <HowItWorksSection />
      <StudioOwnersSection />
      <TestimonialsPlaceholderSection />
    </>
  );
}
