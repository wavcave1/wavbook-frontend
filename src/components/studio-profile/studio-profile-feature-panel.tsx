import { NoticeBanner } from "@/components/ui/notice-banner";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { StudioProfileMetadataSource } from "@/features/public/studio-profile.adapter";

interface StudioProfileFeaturePanelProps {
  categories: string[];
  amenities: string[];
  metadataSource: StudioProfileMetadataSource;
}

export function StudioProfileFeaturePanel({
  categories,
  amenities,
  metadataSource,
}: StudioProfileFeaturePanelProps) {
  return (
    <SurfaceCard className="studio-profile-feature-panel">
      <span className="eyebrow">Categories and amenities</span>

      {metadataSource === "preview" ? (
        <NoticeBanner title="Preview metadata" tone="muted">
          <p>
            These tags come from the frontend preview adapter because the public
            studio detail API does not expose categories or amenities yet.
          </p>
        </NoticeBanner>
      ) : (
        <NoticeBanner title="Metadata placeholder" tone="muted">
          <p>
            Categories and amenities are reserved here, but this public profile
            does not have those fields wired from the backend yet.
          </p>
        </NoticeBanner>
      )}

      <div className="studio-feature-grid">
        <div className="studio-feature-column">
          <h3>Categories</h3>
          {categories.length ? (
            <div className="chip-row">
              {categories.map((category) => (
                <span className="chip chip-active" key={category}>
                  {category}
                </span>
              ))}
            </div>
          ) : (
            <p className="muted-copy">Public category data will appear here.</p>
          )}
        </div>

        <div className="studio-feature-column">
          <h3>Amenities</h3>
          {amenities.length ? (
            <div className="chip-row">
              {amenities.map((amenity) => (
                <span className="chip" key={amenity}>
                  {amenity}
                </span>
              ))}
            </div>
          ) : (
            <p className="muted-copy">Public amenity data will appear here.</p>
          )}
        </div>
      </div>
    </SurfaceCard>
  );
}
