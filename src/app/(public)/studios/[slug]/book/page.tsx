import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking/booking-form";
import { publicApi } from "@/lib/api/endpoints/public-api";
import { resolveRouteInput } from "@/lib/route";

export default async function StudioBookingPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await resolveRouteInput(params);
  const studio = await publicApi.getStudio(slug).catch(() => null);

  if (!studio) {
    notFound();
  }

  return (
    <section className="section">
      <div className="container stack-lg">
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
      </div>
    </section>
  );
}
