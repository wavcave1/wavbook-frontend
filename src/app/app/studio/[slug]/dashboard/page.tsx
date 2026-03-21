"use client";

import Link from "@/compat/next-link";
import { DashboardLoadingGrid, DashboardErrorState } from "@/components/dashboard/dashboard-state";
import { AppLayout } from "@/components/layouts/app-layout";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { SurfaceCard } from "@/components/ui/surface-card";
import {
  loadStudioDashboard,
  loadStudioShellContext,
} from "@/features/dashboard/loaders";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { formatDateTime } from "@/lib/utils";

export default function StudioDashboardPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const shell = useAsyncResource(() => loadStudioShellContext(slug), `shell:${slug}`);
  const { data, error, loading } = useAsyncResource(
    () => loadStudioDashboard(slug),
    `dashboard:${slug}`,
  );

  const upcomingBookings =
    data?.bookings
      .filter((booking) => new Date(booking.start_time) >= new Date())
      .slice(0, 5) ?? [];

  return (
    <AppLayout
      title="Studio dashboard"
      description="Operational summary driven by the real bookings, blocks, publication, and team endpoints."
      studioSlug={slug}
      studioName={shell.data?.studioAccess?.name ?? data?.studio.name}
      studioTimezone={shell.data?.studioAccess?.timezone ?? data?.studio.timezone}
      operatorEmail={shell.data?.me.email}
      accessibleStudios={shell.data?.me.accessible_studios}
      actions={
        <Link href={`/app/studio/${slug}/bookings`} className="button">
          View bookings
        </Link>
      }
    >
      {loading ? (
        <DashboardLoadingGrid
          labels={["Loading studio", "Loading bookings", "Loading publication"]}
        />
      ) : null}

      {error ? (
        <DashboardErrorState title="Could not load dashboard" message={error} />
      ) : null}

      {data ? (
        <>
          <div className="kpi-grid">
            <StatCard
              label="Recent bookings"
              value={String(data.bookings.length)}
              detail="Latest page of bookings from /api/admin/bookings."
            />
            <StatCard
              label="Open blocks"
              value={String(data.blocks.length)}
              detail="Managed with /api/admin/blocks."
            />
            <StatCard
              label="Team members"
              value={String(data.team.length)}
              detail="Backed by /api/admin/team."
            />
            <StatCard
              label="Publication"
              value={data.publication.isPublic ? "Live" : "Draft"}
              detail={
                data.publication.publishReady
                  ? "Profile meets publish requirements."
                  : "Still missing required fields."
              }
            />
          </div>

          <div className="content-grid">
            <div className="stack-lg">
              <SurfaceCard>
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">Upcoming bookings</span>
                    <h2>Next sessions</h2>
                  </div>
                </div>

                <div className="list-stack">
                  {upcomingBookings.length ? (
                  upcomingBookings.map((booking) => (
                    <div className="list-row" key={booking.id}>
                      <div>
                          <strong>{booking.customer_name}</strong>
                          <p>{booking.customer_email}</p>
                        </div>
                        <div>
                          <strong>{formatDateTime(booking.start_time)}</strong>
                          <p>
                            {booking.service} · {booking.payment_status}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="No upcoming sessions"
                      description="The latest bookings response did not include any future sessions."
                    />
                  )}
                </div>
              </SurfaceCard>

              <SurfaceCard>
                <span className="eyebrow">{data.insight.title}</span>
                <p>{data.insight.message}</p>
                <ul className="inline-list">
                  {data.insight.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </SurfaceCard>
            </div>

            <div className="stack-lg">
              <SurfaceCard>
                <span className="eyebrow">Publication readiness</span>
                <h3>{data.publication.isPublic ? "Public now" : "Not yet public"}</h3>
                {data.publication.requiredFields.length ? (
                  <ul className="inline-list">
                    {data.publication.requiredFields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted-copy">No publish blockers were returned.</p>
                )}
              </SurfaceCard>

              <SurfaceCard>
                <span className="eyebrow">Team roster</span>
                <div className="list-stack">
                  {data.team.length ? (
                    data.team.map((member) => (
                      <div className="list-row" key={member.id}>
                        <div>
                          <strong>{member.email}</strong>
                          <p>{member.role}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="No team members"
                      description="The team endpoint returned an empty roster for this studio."
                    />
                  )}
                </div>
              </SurfaceCard>
            </div>
          </div>
        </>
      ) : null}
    </AppLayout>
  );
}
