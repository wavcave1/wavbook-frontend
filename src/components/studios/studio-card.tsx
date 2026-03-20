/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import type { PublicStudioProfile } from "@/types/api";

interface StudioCardProps {
  studio: PublicStudioProfile;
  tags?: string[];
}

export function StudioCard({ studio, tags = [] }: StudioCardProps) {
  const image = studio.heroImage?.url || studio.logo?.url;

  return (
    <article className="studio-card">
      <div className="studio-card-media">
        {image ? (
          <img src={image} alt={studio.heroImage?.altText || studio.displayName} />
        ) : (
          <div className="studio-card-fallback">{studio.displayName.slice(0, 2)}</div>
        )}
      </div>

      <div className="studio-card-body">
        <div className="studio-card-header">
          <span className="chip chip-active">
            {studio.address || studio.serviceArea || "Published studio"}
          </span>
          <h3>{studio.displayName}</h3>
        </div>

        <p>{studio.about}</p>

        {tags.length ? (
          <div className="chip-row studio-card-tags">
            {tags.map((tag) => (
              <span className="chip" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="studio-card-meta">
          <span>{studio.timezone}</span>
          <span>{studio.bookingLinkMode === "external" ? "External booking" : "Instant booking"}</span>
        </div>

        <div className="studio-card-actions">
          <Link href={`/studios/${studio.slug}`} className="button button-secondary">
            View profile
          </Link>
          <Link href={`/studios/${studio.slug}/book`} className="button">
            Book now
          </Link>
        </div>
      </div>
    </article>
  );
}
