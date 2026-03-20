import { notFound } from "next/navigation";
import { StudioProfileBookingCard } from "@/components/studio-profile/studio-profile-booking-card";
import { StudioProfileFeaturePanel } from "@/components/studio-profile/studio-profile-feature-panel";
import { StudioProfileGallery } from "@/components/studio-profile/studio-profile-gallery";
import { StudioProfileHero } from "@/components/studio-profile/studio-profile-hero";
import { StudioProfileOverviewCard } from "@/components/studio-profile/studio-profile-overview-card";
import { StudioProfileReviewsSummary } from "@/components/studio-profile/studio-profile-reviews-summary";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getPublicStudioProfilePageData } from "@/features/public/studio-profile.adapter";
import { resolveRouteInput } from "@/lib/route";

export default async function StudioProfilePage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await resolveRouteInput(params);
  const profile = await getPublicStudioProfilePageData(slug);

  if (!profile) {
    notFound();
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
