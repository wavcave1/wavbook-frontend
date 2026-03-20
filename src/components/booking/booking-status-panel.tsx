import { NoticeBanner } from "@/components/ui/notice-banner";
import type { PaymentIntentStatusResponse } from "@/types/api";

interface BookingStatusPanelProps {
  status: PaymentIntentStatusResponse["status"];
  message: string;
  bookingId?: string;
}

export function BookingStatusPanel({
  status,
  message,
  bookingId,
}: BookingStatusPanelProps) {
  const title =
    status === "confirmed"
      ? "Booking confirmed"
      : status === "failed"
        ? "Payment failed"
        : "Payment processing";

  return (
    <NoticeBanner title={title} tone={status === "confirmed" ? "muted" : "default"}>
      <p>{message}</p>
      {bookingId ? <p>Booking ID: {bookingId}</p> : null}
    </NoticeBanner>
  );
}
