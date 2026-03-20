import { FilterPanel } from "@/components/studios/filter-panel";
import { StudioResultsSummary } from "@/components/studios/results-summary";
import { SearchBar } from "@/components/studios/search-bar";
import { StudioGrid } from "@/components/studios/studio-grid";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { SectionHeader } from "@/components/home/section-header";
import { getStudioBrowseData } from "@/features/public/studios-browse.adapter";
import { readSearchParam, resolveRouteInput } from "@/lib/route";

export default async function StudiosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
}) {
  const params = await resolveRouteInput(searchParams);
  const q = readSearchParam(params.q);
  const location = readSearchParam(params.location);
  const category = readSearchParam(params.category);
  const amenity = readSearchParam(params.amenity);

  const payload = await getStudioBrowseData({
    q,
    location,
    category,
    amenity,
  });

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
      </div>
    </section>
  );
}
