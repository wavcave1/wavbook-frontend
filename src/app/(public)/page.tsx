"use client";

import { BrowseCtaSection } from "@/components/home/browse-cta-section";
import { FeaturedStudiosSection } from "@/components/home/featured-studios-section";
import { HomeHeroSection } from "@/components/home/home-hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { StudioOwnersSection } from "@/components/home/studio-owners-section";
import { TestimonialsPlaceholderSection } from "@/components/home/testimonials-placeholder-section";
import { LoadingCard } from "@/components/ui/loading-card";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { getHomepageLandingData } from "@/features/public/homepage.adapter";

export default function HomePage() {
  const { data, error, loading } = useAsyncResource(getHomepageLandingData, "homepage");

  return (
    <>
      {loading ? (
        <section className="section">
          <div className="container">
            <LoadingCard label="Loading marketplace landing page" />
          </div>
        </section>
      ) : null}

      {error ? (
        <section className="section">
          <div className="container">
            <NoticeBanner title="Could not load homepage">
              <p>{error}</p>
            </NoticeBanner>
          </div>
        </section>
      ) : null}

      {data ? (
        <>
          <HomeHeroSection
            publishedStudioCount={data.publishedStudioCount}
            featuredStudioCount={data.featuredStudios.length}
          />
          <BrowseCtaSection locations={data.locations} />
          <FeaturedStudiosSection
            studios={data.featuredStudios}
            source={data.featuredSource}
          />
          <HowItWorksSection />
          <StudioOwnersSection />
          <TestimonialsPlaceholderSection />
        </>
      ) : null}
    </>
  );
}
