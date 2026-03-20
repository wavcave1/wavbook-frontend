import Link from "next/link";
import { SurfaceCard } from "@/components/ui/surface-card";

interface StudioResultsSummaryProps {
  count: number;
  source: "api" | "mock";
  filters: {
    q: string;
    location: string;
    category: string;
    amenity: string;
  };
}

const activeFilterEntries = (filters: StudioResultsSummaryProps["filters"]) =>
  Object.entries(filters).filter(([, value]) => value);

export function StudioResultsSummary({
  count,
  source,
  filters,
}: StudioResultsSummaryProps) {
  const activeFilters = activeFilterEntries(filters);

  return (
    <SurfaceCard className="results-summary-card">
      <div className="results-summary-grid">
        <div>
          <span className="eyebrow">Results</span>
          <h2>{count} studios</h2>
          <p>
            Source: {source === "api" ? "live marketplace API" : "mock preview adapter"}.
          </p>
        </div>

        <div>
          <span className="eyebrow">Active filters</span>
          {activeFilters.length ? (
            <div className="chip-row">
              {activeFilters.map(([key, value]) => (
                <span className="chip chip-active" key={key}>
                  {key}: {value}
                </span>
              ))}
            </div>
          ) : (
            <p>No filters applied yet.</p>
          )}
        </div>

        <div className="results-summary-actions">
          <Link href="/studios" className="button button-secondary">
            Clear filters
          </Link>
        </div>
      </div>
    </SurfaceCard>
  );
}
