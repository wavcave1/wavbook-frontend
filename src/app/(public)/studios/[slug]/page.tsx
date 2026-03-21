"use client";

import { StudioProfileBookingCard } from "@/components/studio-profile/studio-profile-booking-card";
import { StudioProfileFeaturePanel } from "@/components/studio-profile/studio-profile-feature-panel";
import { StudioProfileGallery } from "@/components/studio-profile/studio-profile-gallery";
import { StudioProfileHero } from "@/components/studio-profile/studio-profile-hero";
import { StudioProfileOverviewCard } from "@/components/studio-profile/studio-profile-overview-card";
import { StudioProfileReviewsSummary } from "@/components/studio-profile/studio-profile-reviews-summary";
import { SurfaceCard } from "@/components/ui/surface-card";
import { LoadingCard } from "@/components/ui/loading-card";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublicStudioProfilePageData } from "@/features/public/studio-profile.adapter";
import { useAsyncResource } from "@/hooks/use-async-resource";

export default function StudioProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { data: profile, error, loading } = useAsyncResource(
    () => getPublicStudioProfilePageData(slug),
    `studio-profile:${slug}`,
  );

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <LoadingCard label="Loading studio profile" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <NoticeBanner title="Could not load studio profile">
            <p>{error}</p>
          </NoticeBanner>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState
            title="Studio not found"
            description="The requested studio could not be found in the marketplace data source."
          />
        </div>
      </section>
    );
  }

  const { studio, source, categories, amenities, metadataSource, reviews } = profile;

  return (
    <>
      <section className="hero-section hero-section-compact">
        <div className="container studio-profile-hero-layout">
          <StudioProfileHero studio={studio} />
          <StudioProfileOverviewCard studio={studio} source={source} />
        </div>
      </section>

      <section className="section">
        <div className="container studio-profile-main-grid">
          <div className="stack-lg">
            <SurfaceCard className="studio-profile-about-card">
              <span className="eyebrow">About the studio</span>
              <h2>{studio.displayName}</h2>
              <p>{studio.about}</p>
            </SurfaceCard>

            <StudioProfileFeaturePanel
              categories={categories}
              amenities={amenities}
              metadataSource={metadataSource}
            />

            <StudioProfileReviewsSummary reviews={reviews} />
          </div>

          <div className="stack-lg">
            <StudioProfileBookingCard studio={studio} />
            <StudioProfileGallery studio={studio} />
          </div>
        </div>
      </section>
    </>
  );
}
