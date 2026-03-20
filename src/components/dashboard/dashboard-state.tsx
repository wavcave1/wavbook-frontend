import { EmptyState } from "@/components/ui/empty-state";
import { LoadingCard } from "@/components/ui/loading-card";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { SurfaceCard } from "@/components/ui/surface-card";

export function DashboardLoadingGrid({
  labels = ["Loading"],
}: {
  labels?: string[];
}) {
  return (
    <div className="kpi-grid">
      {labels.map((label) => (
        <LoadingCard key={label} label={label} />
      ))}
    </div>
  );
}

export function DashboardErrorState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <SurfaceCard className="dashboard-state-card">
      <NoticeBanner title={title}>
        <p>{message}</p>
        {action ? <div className="button-row">{action}</div> : null}
      </NoticeBanner>
    </SurfaceCard>
  );
}

export function DashboardEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <SurfaceCard className="dashboard-state-card">
      <EmptyState title={title} description={description} />
      {action ? <div className="center-actions">{action}</div> : null}
    </SurfaceCard>
  );
}
