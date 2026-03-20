import { EmptyState } from "@/components/ui/empty-state";
import { StudioCard } from "@/components/studios/studio-card";
import type { PublicStudioProfile } from "@/types/api";

interface StudioGridProps {
  studios: PublicStudioProfile[];
  tagsBySlug?: Record<string, string[]>;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function StudioGrid({
  studios,
  tagsBySlug = {},
  emptyTitle = "No studios found",
  emptyDescription = "Adjust the search or location filters once more studios are published.",
}: StudioGridProps) {
  if (studios.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="studio-grid">
      {studios.map((studio) => (
        <StudioCard
          key={studio.id}
          studio={studio}
          tags={tagsBySlug[studio.slug] ?? []}
        />
      ))}
    </div>
  );
}
