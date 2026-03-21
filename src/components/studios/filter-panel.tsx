import Link from "@/compat/next-link";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  action?: string;
  query?: string;
  activeLocation?: string;
  activeCategory?: string;
  activeAmenity?: string;
  locations: string[];
  categories?: string[];
  amenities?: string[];
  title?: string;
  description?: string;
}

export function FilterPanel({
  action = "/studios",
  query = "",
  activeLocation = "",
  activeCategory = "",
  activeAmenity = "",
  locations,
  categories = [],
  amenities = [],
  title = "Popular locations",
  description = "Use quick filters to narrow the browse page without rebuilding the UI.",
}: FilterPanelProps) {
  const uniqueLocations = Array.from(new Set(locations.filter(Boolean))).slice(0, 8);
  const uniqueCategories = Array.from(new Set(categories.filter(Boolean)));
  const uniqueAmenities = Array.from(new Set(amenities.filter(Boolean)));

  const buildHref = (next: {
    location?: string;
    category?: string;
    amenity?: string;
  }) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (next.location) params.set("location", next.location);
    if (next.category) params.set("category", next.category);
    if (next.amenity) params.set("amenity", next.amenity);
    const search = params.toString();
    return search ? `${action}?${search}` : action;
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel-copy">
        <span className="eyebrow">{title}</span>
        <p>{description}</p>
      </div>

      <div className="filter-group-stack">
        <div className="filter-group">
          <span className="filter-group-label">Location</span>
          <Link
            href={buildHref({
              category: activeCategory,
              amenity: activeAmenity,
            })}
            className={cn("chip", !activeLocation && "chip-active")}
          >
            All studios
          </Link>
          {uniqueLocations.map((location) => (
            <Link
              key={location}
              href={buildHref({
                location,
                category: activeCategory,
                amenity: activeAmenity,
              })}
              className={cn("chip", activeLocation === location && "chip-active")}
            >
              {location}
            </Link>
          ))}
        </div>

        {uniqueCategories.length ? (
          <div className="filter-group">
            <span className="filter-group-label">Category</span>
            <Link
              href={buildHref({
                location: activeLocation,
                amenity: activeAmenity,
              })}
              className={cn("chip", !activeCategory && "chip-active")}
            >
              All categories
            </Link>
            {uniqueCategories.map((category) => (
              <Link
                key={category}
                href={buildHref({
                  location: activeLocation,
                  category,
                  amenity: activeAmenity,
                })}
                className={cn("chip", activeCategory === category && "chip-active")}
              >
                {category}
              </Link>
            ))}
          </div>
        ) : null}

        {uniqueAmenities.length ? (
          <div className="filter-group">
            <span className="filter-group-label">Amenities</span>
            <Link
              href={buildHref({
                location: activeLocation,
                category: activeCategory,
              })}
              className={cn("chip", !activeAmenity && "chip-active")}
            >
              All amenities
            </Link>
            {uniqueAmenities.map((amenity) => (
              <Link
                key={amenity}
                href={buildHref({
                  location: activeLocation,
                  category: activeCategory,
                  amenity,
                })}
                className={cn("chip", activeAmenity === amenity && "chip-active")}
              >
                {amenity}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
