"use client";

import { useState } from "react";
import Link from "@/compat/next-link";
import {
  DashboardEmptyState,
  DashboardErrorState,
  DashboardLoadingGrid,
} from "@/components/dashboard/dashboard-state";
import { AppLayout } from "@/components/layouts/app-layout";
import { SurfaceCard } from "@/components/ui/surface-card";
import {
  loadStudioCalendar,
  loadStudioShellContext,
} from "@/features/dashboard/loaders";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { formatDateTime } from "@/lib/utils";

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const getMonthRange = (month: string) => {
  const start = new Date(`${month}-01T00:00:00`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

export default function StudioCalendarPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const shell = useAsyncResource(() => loadStudioShellContext(slug), `shell:${slug}`);
  const [month, setMonth] = useState(getCurrentMonth());
  const range = getMonthRange(month);
  const { data, error, loading } = useAsyncResource(
    () => loadStudioCalendar(slug, range),
    `${slug}:${month}`,
  );

  const groupedDays = !data
    ? []
    : Array.from(
        [
          ...data.bookings.map((booking) => ({
            id: booking.id,
            date: booking.start_time.slice(0, 10),
            title: booking.customer_name,
            detail: `${booking.service} booking`,
            start: booking.start_time,
            type: "booking" as const,
          })),
          ...data.blocks.map((block) => ({
            id: block.id,
            date: block.start_time.slice(0, 10),
            title: block.reason || "Blocked time",
            detail: "Manual block",
            start: block.start_time,
            type: "block" as const,
          })),
        ]
          .sort((left, right) => left.start.localeCompare(right.start))
          .reduce((map, item) => {
            const bucket = map.get(item.date) ?? [];
            bucket.push(item);
            map.set(item.date, bucket);
            return map;
          }, new Map<string, Array<{
            id: string;
            date: string;
            title: string;
            detail: string;
            start: string;
            type: "booking" | "block";
          }>>()),
      );

  return (
    <AppLayout
      title="Calendar"
      description="Month view built by combining bookings and block intervals from existing admin endpoints."
      studioSlug={slug}
      studioName={shell.data?.studioAccess?.name ?? data?.studio.name}
      studioTimezone={shell.data?.studioAccess?.timezone ?? data?.studio.timezone}
      operatorEmail={shell.data?.me.email}
      accessibleStudios={shell.data?.me.accessible_studios}
    >
      <SurfaceCard>
        <label className="field field-inline">
          <span>Month</span>
          <input
            className="input"
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
          />
        </label>
      </SurfaceCard>

      {loading ? <DashboardLoadingGrid labels={["Loading calendar"]} /> : null}
      {error ? (
        <DashboardErrorState title="Could not load calendar" message={error} />
      ) : null}

      {data && groupedDays.length ? (
        <div className="calendar-grid">
          {groupedDays.map(([day, items]) => (
            <SurfaceCard key={day} className="calendar-day">
              <strong>{day}</strong>
              <div className="list-stack">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`calendar-item calendar-item-${item.type}`}
                  >
                    <strong>{item.title}</strong>
                    <p>
                      {item.detail} ·{" "}
                      {formatDateTime(item.start, {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          ))}
        </div>
      ) : null}

      {data && !groupedDays.length ? (
        <DashboardEmptyState
          title="No calendar activity"
          description="No bookings or manual blocks were returned for the selected month."
          action={
            <Link
              href={`/app/studio/${slug}/blocks`}
              className="button button-secondary"
            >
              Manage blocks
            </Link>
          }
        />
      ) : null}
    </AppLayout>
  );
}
