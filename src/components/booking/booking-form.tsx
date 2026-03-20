"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BookingStatusPanel } from "@/components/booking/booking-status-panel";
import { BookingSummary } from "@/components/booking/booking-summary";
import { ContactFields } from "@/components/booking/contact-fields";
import { BookingPaymentSection } from "@/components/booking/payment-section";
import { SessionSelector } from "@/components/booking/session-selector";
import { TimeSlotPicker } from "@/components/booking/time-slot-picker";
import { Button } from "@/components/ui/button";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { SurfaceCard } from "@/components/ui/surface-card";
import {
  buildAvailabilityRange,
  buildBookingStartIso,
  buildDailySlots,
  buildPricingDateIso,
  getDefaultBookingDate,
  groupSlots,
  parsePaymentIntentIdFromClientSecret,
  paymentTypeOptions,
  serviceOptions,
} from "@/features/public/booking-flow";
import { publicApi } from "@/lib/api/endpoints/public-api";
import type {
  PaymentIntentStatusResponse,
  PriceMap,
  PublicStudioProfile,
} from "@/types/api";

interface BookingFormProps {
  studio: PublicStudioProfile;
}

interface BookingDraft {
  service: "2hr" | "4hr" | "8hr" | "12hr";
  paymentType: "full" | "deposit";
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
}

interface CheckoutState {
  clientSecret: string;
  paymentIntentId: string;
  amountDueNow: number | null;
}

interface BookingStatusView {
  status: PaymentIntentStatusResponse["status"];
  message: string;
  bookingId?: string;
}

const mapPaymentStatus = (
  payload: PaymentIntentStatusResponse,
): BookingStatusView => {
  if (payload.status === "confirmed") {
    return {
      status: payload.status,
      message:
        "Payment completed and the booking has been finalized by the existing backend flow.",
      bookingId: payload.booking?.id,
    };
  }

  if (payload.status === "failed") {
    return {
      status: payload.status,
      message: payload.error || "Payment failed. You can try the payment step again.",
    };
  }

  return {
    status: payload.status,
    message:
      "Payment is processing. The backend status endpoint will confirm the booking once Stripe and the webhook flow finish.",
  };
};

export function BookingForm({ studio }: BookingFormProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [draft, setDraft] = useState<BookingDraft>({
    service: "2hr",
    paymentType: "full",
    date: getDefaultBookingDate(),
    time: "",
    name: "",
    email: "",
    phone: "",
  });
  const [dailyPrices, setDailyPrices] = useState<PriceMap | null>(null);
  const [availability, setAvailability] = useState<{
    busy: Array<{ id: string; start_time: string; end_time: string; type: "booking" | "block" }>;
  } | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<CheckoutState | null>(null);
  const [intentError, setIntentError] = useState<string | null>(null);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [statusView, setStatusView] = useState<BookingStatusView | null>(null);

  const selectedStartIso = draft.time
    ? buildBookingStartIso(draft.date, draft.time)
    : undefined;
  const fullSessionPrice = dailyPrices?.[draft.service] ?? null;
  const slots = availability
    ? buildDailySlots(draft.date, draft.service, availability.busy)
    : [];
  const slotGroups = groupSlots(slots);
  const hasAnyAvailableSlot = slots.some((slot) => slot.available);
  const canCreateCheckout =
    Boolean(draft.time && draft.name.trim() && draft.email.trim()) &&
    !loadingAvailability &&
    !loadingPrices &&
    !loadError &&
    !creatingIntent;

  const resetCheckoutState = () => {
    setCheckout(null);
    setIntentError(null);
    setStatusView(null);
  };

  const applyDraftPatch = (patch: Partial<BookingDraft>) => {
    const clearsTime = Object.prototype.hasOwnProperty.call(patch, "date") ||
      Object.prototype.hasOwnProperty.call(patch, "service");

    setDraft((current) => ({
      ...current,
      ...patch,
      ...(clearsTime ? { time: "" } : {}),
    }));

    resetCheckoutState();
  };

  useEffect(() => {
    let active = true;
    const range = buildAvailabilityRange(draft.date);

    Promise.resolve().then(async () => {
      setLoadError(null);
      setLoadingAvailability(true);
      setLoadingPrices(true);

      try {
        const [prices, availabilityPayload] = await Promise.all([
          publicApi.getPrices(buildPricingDateIso(draft.date)),
          publicApi.getStudioAvailability(studio.slug, range),
        ]);

        if (!active) return;
        setDailyPrices(prices);
        setAvailability(availabilityPayload);
      } catch (error: unknown) {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load backend pricing or availability.",
        );
        setDailyPrices(null);
        setAvailability(null);
      } finally {
        if (!active) return;
        setLoadingAvailability(false);
        setLoadingPrices(false);
      }
    });

    return () => {
      active = false;
    };
  }, [draft.date, studio.slug]);

  useEffect(() => {
    const paymentIntentId = searchParams.get("payment_intent");
    if (!paymentIntentId) return;

    let active = true;

    Promise.resolve().then(async () => {
      try {
        const payload = await publicApi.getPaymentStatus(paymentIntentId);
        if (!active) return;
        setStatusView(mapPaymentStatus(payload));
      } catch (error: unknown) {
        if (!active) return;
        setStatusView({
          status: "pending",
          message:
            error instanceof Error
              ? error.message
              : "Payment returned from Stripe, but booking status could not be refreshed yet.",
        });
      } finally {
        if (active) {
          router.replace(pathname);
        }
      }
    });

    return () => {
      active = false;
    };
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (!checkout?.paymentIntentId) return;
    if (!statusView || !["pending", "confirmed", "failed"].includes(statusView.status)) {
      return;
    }
    if (statusView.status === "confirmed" || statusView.status === "failed") return;

    let active = true;
    let timeoutId: number | undefined;
    let attempts = 0;

    const poll = async () => {
      attempts += 1;

      try {
        const payload = await publicApi.getPaymentStatus(checkout.paymentIntentId);
        if (!active) return;

        const nextStatus = mapPaymentStatus(payload);
        setStatusView(nextStatus);

        if (
          nextStatus.status !== "confirmed" &&
          nextStatus.status !== "failed" &&
          attempts < 12
        ) {
          timeoutId = window.setTimeout(poll, 2000);
        }
      } catch {
        if (!active) return;

        if (attempts < 12) {
          timeoutId = window.setTimeout(poll, 2500);
        }
      }
    };

    timeoutId = window.setTimeout(poll, 1500);

    return () => {
      active = false;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [checkout?.paymentIntentId, statusView]);

  const handleCreateCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.time) {
      setIntentError("Choose a time slot before continuing to payment.");
      return;
    }

    setCreatingIntent(true);
    setIntentError(null);
    setStatusView(null);

    try {
      const startIso = buildBookingStartIso(draft.date, draft.time);
      const response = await publicApi.createPaymentIntent({
        studioSlug: studio.slug,
        service: draft.service,
        paymentType: draft.paymentType,
        name: draft.name,
        email: draft.email,
        phone: draft.phone,
        date: startIso,
      });

      if (!response.clientSecret) {
        throw new Error("Backend did not return a payment client secret.");
      }

      setCheckout({
        clientSecret: response.clientSecret,
        paymentIntentId: parsePaymentIntentIdFromClientSecret(response.clientSecret),
        amountDueNow: null,
      });
    } catch (error: unknown) {
      setIntentError(
        error instanceof Error
          ? error.message
          : "Could not create a payment intent.",
      );
    } finally {
      setCreatingIntent(false);
    }
  };

  if (studio.bookingLinkMode === "external" && studio.externalBookingUrl) {
    return (
      <NoticeBanner title="External booking link">
        <p>
          This studio uses an external booking flow. Continue on the external
          booking page instead of the internal React checkout.
        </p>
        <Link href={studio.externalBookingUrl} className="button" target="_blank">
          Open external booking
        </Link>
      </NoticeBanner>
    );
  }

  return (
    <div className="booking-layout booking-flow-layout">
      <div className="stack-lg">
        <form className="booking-flow-card" onSubmit={handleCreateCheckout}>
          <SessionSelector
            title="Service or session selection"
            value={draft.service}
            options={serviceOptions}
            onChange={(service) => applyDraftPatch({ service })}
          />

          <SessionSelector
            title="Payment type selection"
            value={draft.paymentType}
            options={paymentTypeOptions}
            onChange={(paymentType) => applyDraftPatch({ paymentType })}
          />

          <SurfaceCard className="booking-step-card">
            <div className="booking-step-header">
              <div>
                <span className="eyebrow">Date and time</span>
                <h3>Choose a day and available start time</h3>
                <p>
                  Availability is loaded from the existing backend endpoint. The
                  backend still validates the final selection when the payment
                  intent is created.
                </p>
              </div>
            </div>

            <label className="field">
              <span>Date picker</span>
              <input
                className="input"
                type="date"
                value={draft.date}
                min={getDefaultBookingDate()}
                onChange={(event) => applyDraftPatch({ date: event.target.value })}
              />
            </label>

            <TimeSlotPicker
              groups={slotGroups}
              selectedTime={draft.time}
              loading={loadingAvailability}
              onSelect={(time) => applyDraftPatch({ time })}
            />

            {!loadingAvailability && !hasAnyAvailableSlot ? (
              <NoticeBanner title="No available time slots">
                <p>
                  The backend availability response did not leave any open starts
                  for this date and session length.
                </p>
              </NoticeBanner>
            ) : null}
          </SurfaceCard>

          <SurfaceCard className="booking-step-card">
            <ContactFields
              name={draft.name}
              email={draft.email}
              phone={draft.phone}
              onChange={applyDraftPatch}
            />
          </SurfaceCard>

          {loadError ? (
            <NoticeBanner title="Booking data error">
              <p>{loadError}</p>
            </NoticeBanner>
          ) : null}

          {intentError ? (
            <NoticeBanner title="Checkout error">
              <p>{intentError}</p>
            </NoticeBanner>
          ) : null}

          <Button type="submit" disabled={!canCreateCheckout}>
            {creatingIntent ? "Creating secure checkout..." : "Continue to payment"}
          </Button>
        </form>

        {statusView ? (
          <BookingStatusPanel
            status={statusView.status}
            message={statusView.message}
            bookingId={statusView.bookingId}
          />
        ) : null}

        {checkout?.clientSecret && statusView?.status !== "confirmed" ? (
          <BookingPaymentSection
            clientSecret={checkout.clientSecret}
            studioName={studio.displayName}
            onIntentReady={({ paymentIntentId, amountDue }) => {
              setCheckout((current) =>
                current
                  ? {
                      ...current,
                      paymentIntentId,
                      amountDueNow: amountDue,
                    }
                  : current,
              );
            }}
            onPaymentResult={({ paymentIntentId, stripeStatus, amountDue }) => {
              setCheckout((current) =>
                current
                  ? {
                      ...current,
                      paymentIntentId,
                      amountDueNow: amountDue,
                    }
                  : current,
              );
              setStatusView({
                status:
                  stripeStatus === "succeeded" || stripeStatus === "processing"
                    ? "pending"
                    : "failed",
                message:
                  stripeStatus === "succeeded" || stripeStatus === "processing"
                    ? "Payment submitted. Waiting for backend confirmation."
                    : "Stripe reported a payment problem.",
              });
            }}
          />
        ) : (
          <SurfaceCard className="booking-step-card">
            <span className="eyebrow">Payment section</span>
            <h3>Secure payment appears after the backend creates a PaymentIntent</h3>
            <p>
              The React page now keeps the old flow shape: collect booking
              details, create the backend PaymentIntent, then confirm payment with
              Stripe and wait for the existing webhook/status flow to finalize the
              booking.
            </p>
          </SurfaceCard>
        )}
      </div>

      <BookingSummary
        studio={studio}
        service={draft.service}
        paymentType={draft.paymentType}
        date={selectedStartIso}
        fullSessionPrice={fullSessionPrice}
        amountDueNow={checkout?.amountDueNow}
        priceNote={
          loadingPrices
            ? "Loading backend-calculated session pricing."
            : "Full session pricing is loaded from the backend. The exact checkout amount is locked by the backend PaymentIntent."
        }
      />
    </div>
  );
}
