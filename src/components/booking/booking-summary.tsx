import { SurfaceCard } from "@/components/ui/surface-card";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type {
  PaymentType,
  PublicStudioProfile,
  Duration,
} from "@/types/api";

interface BookingSummaryProps {
  studio: PublicStudioProfile;
  service: Duration;
  paymentType: PaymentType;
  date?: string;
  fullSessionPrice?: number | null;
  amountDueNow?: number | null;
  priceNote?: string;
}

export function BookingSummary({
  studio,
  service,
  paymentType,
  date,
  fullSessionPrice,
  amountDueNow,
  priceNote,
}: BookingSummaryProps) {
  return (
    <SurfaceCard className="booking-summary">
      <span className="eyebrow">Booking summary</span>
      <h3>{studio.displayName}</h3>

      <div className="summary-list">
        <div>
          <span>Session</span>
          <strong>{service}</strong>
        </div>
        <div>
          <span>Payment</span>
          <strong>{paymentType}</strong>
        </div>
        <div>
          <span>Start</span>
          <strong>{date ? formatDateTime(date) : "Choose a date"}</strong>
        </div>
        <div>
          <span>Full session price</span>
          <strong>{formatCurrency(fullSessionPrice)}</strong>
        </div>
        <div>
          <span>{paymentType === "deposit" ? "Due at checkout" : "Due now"}</span>
          <strong>
            {amountDueNow === null || amountDueNow === undefined
              ? "Calculated by backend at checkout"
              : formatCurrency(amountDueNow)}
          </strong>
        </div>
      </div>

      {priceNote ? <p className="muted-copy">{priceNote}</p> : null}
      <p className="muted-copy">{studio.bookingPolicy}</p>
    </SurfaceCard>
  );
}
