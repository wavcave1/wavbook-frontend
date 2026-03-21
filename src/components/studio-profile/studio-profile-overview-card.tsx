import Link from "@/compat/next-link";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { PublicStudioProfile } from "@/types/api";
import type { StudioProfileSource } from "@/features/public/studio-profile.adapter";

interface StudioProfileOverviewCardProps {
  studio: PublicStudioProfile;
  source: StudioProfileSource;
}

export function StudioProfileOverviewCard({
  studio,
  source,
}: StudioProfileOverviewCardProps) {
  return (
    <SurfaceCard className="studio-profile-overview-card">
      <div className="stack-md">
        <span className="eyebrow">Studio name</span>
        <h1 className="studio-profile-title">{studio.displayName}</h1>
        <p className="lead-copy">{studio.about}</p>
      </div>

      {source === "mock" ? (
        <NoticeBanner title="Preview profile in use" tone="muted">
          <p>
            The live public studio detail endpoint was unavailable, so this page
            is rendering the local preview adapter for the same route shape.
          </p>
        </NoticeBanner>
      ) : null}

      <div className="studio-profile-summary-list">
        <div>
          <span>Location</span>
          <strong>{studio.address || "Address not published"}</strong>
        </div>
        <div>
          <span>Service area</span>
          <strong>{studio.serviceArea || "Service area not published"}</strong>
        </div>
        <div>
          <span>Timezone</span>
          <strong>{studio.timezone}</strong>
        </div>
      </div>

      <div className="hero-actions">
        <Link href={`/studios/${studio.slug}/book`} className="button">
          Book this studio
        </Link>
        <Link href="/studios" className="button button-secondary">
          Back to studios
        </Link>
      </div>
    </SurfaceCard>
  );
}
