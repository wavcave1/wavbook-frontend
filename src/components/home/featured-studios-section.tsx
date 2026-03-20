import Link from "next/link";
import { SectionHeader } from "@/components/home/section-header";
import { StudioGrid } from "@/components/studios/studio-grid";
import { NoticeBanner } from "@/components/ui/notice-banner";
import type { PublicStudioProfile } from "@/types/api";

interface FeaturedStudiosSectionProps {
  studios: PublicStudioProfile[];
  source: "api" | "mock";
}

export function FeaturedStudiosSection({
  studios,
  source,
}: FeaturedStudiosSectionProps) {
  return (
    <section className="section">
      <div className="container stack-lg">
        <SectionHeader
          eyebrow="Featured studios"
          title="Showcase bookable rooms that deserve the front page"
          description="This section is fed by the marketplace data adapter so the landing page can stay stable whether the API responds live or falls back to a local preview dataset."
          action={
            <Link href="/studios" className="button button-secondary">
              View marketplace
            </Link>
          }
        />

        {source === "mock" ? (
          <NoticeBanner title="Preview data in use" tone="muted">
            <p>
              Featured studios are coming from a local mock adapter because the
              marketplace API was not available during render.
            </p>
          </NoticeBanner>
        ) : null}

        <StudioGrid
          studios={studios}
          emptyTitle="No featured studios yet"
          emptyDescription="Publish a studio profile in the backend and it can appear here automatically."
        />
      </div>
    </section>
  );
}
