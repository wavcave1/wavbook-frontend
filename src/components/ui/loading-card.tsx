import { SurfaceCard } from "@/components/ui/surface-card";

export function LoadingCard({ label = "Loading" }: { label?: string }) {
  return (
    <SurfaceCard className="loading-card">
      <div className="loading-line" />
      <div className="loading-line loading-line-short" />
      <p>{label}</p>
    </SurfaceCard>
  );
}
