"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DashboardEmptyState,
  DashboardErrorState,
  DashboardLoadingGrid,
} from "@/components/dashboard/dashboard-state";
import { AppLayout } from "@/components/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { loadAppHome } from "@/features/dashboard/loaders";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { authApi } from "@/lib/api/endpoints/auth-api";

export default function OperatorHomePage() {
  const router = useRouter();
  const { data, error, loading } = useAsyncResource(loadAppHome, "app-home");

  const handleLogout = async () => {
    await authApi.logout().catch(() => undefined);
    router.push("/login");
    router.refresh();
  };

  return (
    <AppLayout
      title="Studio operator hub"
      description="Choose a studio workspace and move into bookings, calendar, blocks, and settings."
      showSidebar={false}
      operatorEmail={data?.email}
      accessibleStudios={data?.accessible_studios}
      actions={
        data ? (
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        ) : null
      }
    >
      {loading ? (
        <DashboardLoadingGrid
          labels={["Loading studio access", "Loading workspace cards"]}
        />
      ) : null}

      {error ? (
        <DashboardErrorState
          title="Authentication required"
          message={error}
          action={
            <Link href="/login" className="button">
              Go to login
            </Link>
          }
        />
      ) : null}

      {data && data.accessible_studios.length ? (
        <>
          <SurfaceCard>
            <span className="eyebrow">Signed in as</span>
            <h2>{data.email}</h2>
            <p className="muted-copy">
              Current studio: {data.current_studio?.name || "No studio selected"}.
            </p>
          </SurfaceCard>

          <div className="studio-grid">
            {data.accessible_studios.map((studio) => (
              <SurfaceCard key={studio.id} className="workspace-card">
                <span className="chip chip-active">{studio.membership_role}</span>
                <h3>{studio.name}</h3>
                <p className="muted-copy">{studio.timezone}</p>
                <div className="studio-card-actions">
                  <Link
                    href={`/app/studio/${studio.slug}/dashboard`}
                    className="button"
                  >
                    Open dashboard
                  </Link>
                  <Link
                    href={`/app/studio/${studio.slug}/settings/profile`}
                    className="button button-secondary"
                  >
                    Settings
                  </Link>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </>
      ) : null}

      {data && !data.accessible_studios.length ? (
        <DashboardEmptyState
          title="No studio workspaces yet"
          description="Your account is authenticated, but no accessible studios were returned from the backend."
          action={
            <Link href="/register" className="button button-secondary">
              Register another account
            </Link>
          }
        />
      ) : null}
    </AppLayout>
  );
}
