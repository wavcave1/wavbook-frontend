import { SurfaceCard } from "@/components/ui/surface-card";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <SurfaceCard className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </SurfaceCard>
  );
}
