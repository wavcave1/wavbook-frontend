"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DashboardEmptyState,
  DashboardErrorState,
  DashboardLoadingGrid,
} from "@/components/dashboard/dashboard-state";
import { AppLayout } from "@/components/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import {
  loadStudioBookings,
  loadStudioShellContext,
} from "@/features/dashboard/loaders";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { formatDateTime } from "@/lib/utils";
import type { BookingFilters } from "@/types/api";

export default function StudioBookingsPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const shell = useAsyncResource(() => loadStudioShellContext(slug), `shell:${slug}`);
  const [draftFilters, setDraftFilters] = useState<BookingFilters>({
    query: "",
    service: "",
    booking_status: "",
    payment_status: "",
    pageSize: 20,
  });
  const [filters, setFilters] = useState<BookingFilters>(draftFilters);
  const { data, error, loading } = useAsyncResource(
    () => loadStudioBookings(slug, filters),
    `${slug}:${JSON.stringify(filters)}`,
  );

  return (
    <AppLayout
      title="Bookings"
      description="Search and review booking records from the live admin API."
      studioSlug={slug}
      studioName={shell.data?.studioAccess?.name ?? data?.studio.name}
      studioTimezone={shell.data?.studioAccess?.timezone ?? data?.studio.timezone}
      operatorEmail={shell.data?.me.email}
      accessibleStudios={shell.data?.me.accessible_studios}
    >
      <SurfaceCard>
        <form
          className="toolbar-grid"
          onSubmit={(event) => {
            event.preventDefault();
            setFilters(draftFilters);
          }}
        >
          <label className="field">
            <span>Search</span>
            <input
              className="input"
              value={draftFilters.query ?? ""}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  query: event.target.value,
                }))
              }
              placeholder="Customer or payment intent"
            />
          </label>

          <label className="field">
            <span>Service</span>
            <select
              className="select"
              value={draftFilters.service ?? ""}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  service: event.target.value as BookingFilters["service"],
                }))
              }
            >
              <option value="">All</option>
              <option value="2hr">2hr</option>
              <option value="4hr">4hr</option>
              <option value="8hr">8hr</option>
              <option value="12hr">12hr</option>
            </select>
          </label>

          <label className="field">
            <span>Status</span>
            <select
              className="select"
              value={draftFilters.booking_status ?? ""}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  booking_status: event.target.value as BookingFilters["booking_status"],
                }))
              }
            >
              <option value="">All</option>
              <option value="confirmed">confirmed</option>
              <option value="cancelled">cancelled</option>
              <option value="completed">completed</option>
              <option value="no_show">no_show</option>
            </select>
          </label>

          <label className="field">
            <span>Payment</span>
            <select
              className="select"
              value={draftFilters.payment_status ?? ""}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  payment_status: event.target.value as BookingFilters["payment_status"],
                }))
              }
            >
              <option value="">All</option>
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="failed">failed</option>
            </select>
          </label>

          <Button type="submit">Apply filters</Button>
        </form>
      </SurfaceCard>

      {loading ? <DashboardLoadingGrid labels={["Loading bookings"]} /> : null}

      {error ? (
        <DashboardErrorState title="Could not load bookings" message={error} />
      ) : null}

      {data && data.bookings.items.length ? (
        <SurfaceCard>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Results</span>
              <h2>{data.bookings.total} bookings returned</h2>
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Session</th>
                  <th>Start</th>
                  <th>Booking</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {data.bookings.items.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <strong>{booking.customer_name}</strong>
                      <p>{booking.customer_email}</p>
                    </td>
                    <td>
                      {booking.service}
                      <p>{booking.payment_type}</p>
                    </td>
                    <td>{formatDateTime(booking.start_time)}</td>
                    <td>{booking.booking_status}</td>
                    <td>{booking.payment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SurfaceCard>
      ) : null}

      {data && !data.bookings.items.length ? (
        <DashboardEmptyState
          title="No bookings found"
          description="The current search and status filters did not return any booking records."
          action={
            <Link
              href={`/app/studio/${slug}/calendar`}
              className="button button-secondary"
            >
              Review calendar
            </Link>
          }
        />
      ) : null}
    </AppLayout>
  );
}
