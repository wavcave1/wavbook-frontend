
import { SurfaceCard } from "@/components/ui/surface-card";
import type { PublicStudioProfile } from "@/types/api";

interface StudioProfileGalleryProps {
  studio: PublicStudioProfile;
}

export function StudioProfileGallery({ studio }: StudioProfileGalleryProps) {
  const galleryItems = studio.gallery;

  return (
    <SurfaceCard className="studio-profile-gallery-card">
      <span className="eyebrow">Gallery</span>
      {galleryItems.length ? (
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <img
              key={item.url}
              src={item.url}
              alt={item.altText || studio.displayName}
              className="gallery-image"
            />
          ))}
        </div>
      ) : (
        <div className="studio-gallery-empty">
          {studio.heroImage?.url ? (
            <>
              <img
                src={studio.heroImage.url}
                alt={studio.heroImage.altText || studio.displayName}
                className="studio-gallery-preview"
              />
              <p className="muted-copy">
                Only hero media is published right now. Additional gallery items
                can appear here later.
              </p>
            </>
          ) : (
            <p className="muted-copy">
              No gallery media is published yet. This section stays visible as a
              placeholder for future public assets.
            </p>
          )}
        </div>
      )}
    </SurfaceCard>
  );
}
