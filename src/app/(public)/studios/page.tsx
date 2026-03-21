"use client";

import { useMemo } from "react";
import { useSearchParams } from "@/compat/next-navigation";
import { FilterPanel } from "@/components/studios/filter-panel";
import { StudioResultsSummary } from "@/components/studios/results-summary";
import { SearchBar } from "@/components/studios/search-bar";
import { StudioGrid } from "@/components/studios/studio-grid";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { LoadingCard } from "@/components/ui/loading-card";
import { SectionHeader } from "@/components/home/section-header";
import { getStudioBrowseData } from "@/features/public/studios-browse.adapter";
import { useAsyncResource } from "@/hooks/use-async-resource";

export default function StudiosPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const location = searchParams.get("location") ?? "";
  const category = searchParams.get("category") ?? "";
  const amenity = searchParams.get("amenity") ?? "";
  const filters = useMemo(
    () => ({ q, location, category, amenity }),
    [amenity, category, location, q],
  );
  const { data: payload, error, loading } = useAsyncResource(
    () => getStudioBrowseData(filters),
    JSON.stringify(filters),
  );

  return (
    <section className="section">
      <div className="container stack-lg">
        <SectionHeader
          eyebrow="Browse studios"
          title="Search the public marketplace"
          description="Text query and location are connected to the existing public studios endpoint. Category and amenity stay as explicit preview filters until the backend exposes those fields."
        />

        <SearchBar
          defaultQuery={q}
          defaultLocation={location}
          title="Search by studio name or slug"
          subtitle="Use the same browse form on desktop and mobile without changing the route shape."
        />

        {payload ? (
          <>
            <FilterPanel
              query={q}
              activeLocation={location}
              activeCategory={category}
              activeAmenity={amenity}
              locations={payload.locations}
              categories={payload.categories}
              amenities={payload.amenities}
              title="Browse filters"
              description="Location is API-backed today. Category and amenity are wired as preview filters for the mock fallback adapter."
            />

            {payload.source === "mock" ? (
              <NoticeBanner title="Mock fallback in use" tone="muted">
                <p>
                  The browse adapter could not reach the public studios API, so the
                  page is rendering local preview data instead.
                </p>
              </NoticeBanner>
            ) : null}

            {(category || amenity) && !payload.placeholderFiltersSupported ? (
              <NoticeBanner title="Preview filters selected" tone="muted">
                <p>
                  Category and amenity are placeholder filters right now. They stay
                  in the URL and UI, but the live backend does not expose those
                  fields yet.
                </p>
              </NoticeBanner>
            ) : null}

            <StudioResultsSummary
              count={payload.count}
              source={payload.source}
              filters={payload.filters}
            />

            <StudioGrid studios={payload.studios} tagsBySlug={payload.tagsBySlug} />
          </>
        ) : null}

        {loading ? <LoadingCard label="Loading studios" /> : null}

        {error ? (
          <NoticeBanner title="Could not load studios">
            <p>{error}</p>
          </NoticeBanner>
        ) : null}
      </div>
    </section>
  );
}
