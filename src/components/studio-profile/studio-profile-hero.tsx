
import type { PublicStudioProfile } from "@/types/api";
import { getInitials } from "@/lib/utils";

interface StudioProfileHeroProps {
  studio: PublicStudioProfile;
}

export function StudioProfileHero({ studio }: StudioProfileHeroProps) {
  const heroImage = studio.heroImage?.url || null;
  const logo = studio.logo?.url || null;
  const location = studio.address || studio.serviceArea || "Location pending";

  return (
    <div className="studio-profile-media-card">
      {heroImage ? (
        <img
          src={heroImage}
          alt={studio.heroImage?.altText || studio.displayName}
          className="studio-profile-media-image"
        />
      ) : null}

      <div className="studio-profile-media-overlay" />

      <div className="studio-profile-media-content">
        <div className="studio-profile-logo-badge">
          {logo ? (
            <img
              src={logo}
              alt={studio.logo?.altText || `${studio.displayName} logo`}
              className="studio-profile-logo-image"
            />
          ) : (
            <div className="studio-profile-logo-fallback">
              {getInitials(studio.displayName)}
            </div>
          )}
        </div>

        <div className="studio-profile-media-copy">
          <span className="eyebrow">Public studio profile</span>
          <strong>{location}</strong>
          <p>{heroImage ? "Hero media published" : "Hero media placeholder"}</p>
        </div>
      </div>
    </div>
  );
}
