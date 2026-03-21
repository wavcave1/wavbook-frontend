import Link from "@/compat/next-link";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { PublicStudioProfile } from "@/types/api";

interface StudioProfileBookingCardProps {
  studio: PublicStudioProfile;
}

export function StudioProfileBookingCard({
  studio,
}: StudioProfileBookingCardProps) {
  return (
    <SurfaceCard className="studio-profile-booking-card">
      <span className="eyebrow">Booking call to action</span>
      <h3>Ready to book {studio.displayName}?</h3>
      <p>
        Continue to the public booking flow for session selection and payment
        intent creation.
      </p>

      <div className="studio-profile-policy-card">
        <span>Public booking policy</span>
        <p>{studio.bookingPolicy}</p>
      </div>

      <Link href={`/studios/${studio.slug}/book`} className="button button-block">
        Continue to booking
      </Link>
    </SurfaceCard>
  );
}
