"use client";

import { BookingForm } from "@/components/booking/booking-form";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingCard } from "@/components/ui/loading-card";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { publicApi } from "@/lib/api/endpoints/public-api";

export default function StudioBookingPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { data: studio, error, loading } = useAsyncResource(
    () => publicApi.getStudio(slug).catch(() => null),
    `studio-booking:${slug}`,
  );

  return (
    <section className="section">
      <div className="container stack-lg">
        {loading ? <LoadingCard label="Loading booking flow" /> : null}

        {error ? (
          <NoticeBanner title="Could not load booking flow">
            <p>{error}</p>
          </NoticeBanner>
        ) : null}

        {studio ? (
          <>
            <div className="section-heading">
              <div>
                <span className="eyebrow">Booking flow</span>
                <h1>Book {studio.displayName}</h1>
                <p className="section-description">
                  This page uses backend pricing, backend availability, and the
                  existing Stripe PaymentIntent flow so the legacy booking frontend
                  can be retired without changing booking logic on the server.
                </p>
              </div>
            </div>

            <BookingForm studio={studio} />
          </>
        ) : null}

        {!loading && !studio && !error ? (
          <EmptyState
            title="Studio not found"
            description="The requested studio could not be loaded for booking."
          />
        ) : null}
      </div>
    </section>
  );
}
