import { NoticeBanner } from "@/components/ui/notice-banner";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { StudioReviewResource } from "@/types/api";

interface StudioProfileReviewsSummaryProps {
  reviews: StudioReviewResource;
}

export function StudioProfileReviewsSummary({
  reviews,
}: StudioProfileReviewsSummaryProps) {
  return (
    <SurfaceCard className="studio-profile-reviews-card">
      <span className="eyebrow">Reviews summary</span>
      <div className="studio-review-placeholder-row" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <span className="studio-review-dot" key={index} />
        ))}
      </div>
      <h3>Public reviews summary placeholder</h3>
      <p>{reviews.message}</p>
      <NoticeBanner title="Future integration" tone="muted">
        <p>
          When a real public reviews source exists, this section can swap to live
          counts, average rating, and recent quotes without changing the page
          layout.
        </p>
      </NoticeBanner>
    </SurfaceCard>
  );
}
