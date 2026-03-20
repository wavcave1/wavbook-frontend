import { SurfaceCard } from "@/components/ui/surface-card";

interface StatCardProps {
  label: string;
  value: string;
  detail?: string;
}

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <SurfaceCard className="stat-card">
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      {detail ? <p>{detail}</p> : null}
    </SurfaceCard>
  );
}
