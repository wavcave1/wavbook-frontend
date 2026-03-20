"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { SurfaceCard } from "@/components/ui/surface-card";
import { env } from "@/lib/env";
import { formatCurrency } from "@/lib/utils";

const stripePromise = env.stripePublishableKey
  ? loadStripe(env.stripePublishableKey)
  : null;

interface BookingPaymentSectionProps {
  clientSecret: string;
  studioName: string;
  onIntentReady: (payload: { paymentIntentId: string; amountDue: number | null }) => void;
  onPaymentResult: (payload: {
    paymentIntentId: string;
    stripeStatus: string;
    amountDue: number | null;
  }) => void;
}

export function BookingPaymentSection({
  clientSecret,
  studioName,
  onIntentReady,
  onPaymentResult,
}: BookingPaymentSectionProps) {
  const options = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "stripe" as const,
        variables: {
          colorPrimary: "#0f766e",
          colorBackground: "#ffffff",
          colorText: "#112032",
          borderRadius: "16px",
        },
      },
    }),
    [clientSecret],
  );

  if (!env.stripePublishableKey || !stripePromise) {
    return (
      <NoticeBanner title="Stripe publishable key missing">
        <p>
          Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to the frontend environment to
          render the payment section. The backend payment-intent flow is already
          in place.
        </p>
      </NoticeBanner>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentElementForm
        clientSecret={clientSecret}
        studioName={studioName}
        onIntentReady={onIntentReady}
        onPaymentResult={onPaymentResult}
      />
    </Elements>
  );
}

function StripePaymentElementForm({
  clientSecret,
  studioName,
  onIntentReady,
  onPaymentResult,
}: BookingPaymentSectionProps) {
  const stripe = useStripe();
  const elements = useElements();
  const emitIntentReady = useEffectEvent(onIntentReady);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amountDue, setAmountDue] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    if (!stripe) return;

    stripe.retrievePaymentIntent(clientSecret).then((result) => {
      if (!active || !result.paymentIntent) return;

      const nextAmount = result.paymentIntent.amount / 100;
      setAmountDue(nextAmount);
      emitIntentReady({
        paymentIntentId: result.paymentIntent.id,
        amountDue: nextAmount,
      });
    });

    return () => {
      active = false;
    };
  }, [clientSecret, stripe]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setSubmitting(false);
      setError(result.error.message || "Payment could not be completed.");
      return;
    }

    if (result.paymentIntent) {
      onPaymentResult({
        paymentIntentId: result.paymentIntent.id,
        stripeStatus: result.paymentIntent.status,
        amountDue:
          typeof result.paymentIntent.amount === "number"
            ? result.paymentIntent.amount / 100
            : amountDue,
      });
    }

    setSubmitting(false);
  };

  return (
    <SurfaceCard className="payment-section-card">
      <div className="stack-md">
        <div>
          <span className="eyebrow">Payment section</span>
          <h3>Secure checkout for {studioName}</h3>
          <p>
            This step uses the backend-created Stripe PaymentIntent and keeps the
            existing webhook-based booking finalization flow intact.
          </p>
        </div>

        <div className="payment-inline-summary">
          <span>Amount due now</span>
          <strong>{formatCurrency(amountDue)}</strong>
        </div>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="payment-element-shell">
          <PaymentElement />
        </div>

        {error ? (
          <NoticeBanner title="Payment error">
            <p>{error}</p>
          </NoticeBanner>
        ) : null}

        <Button type="submit" disabled={!stripe || !elements || submitting}>
          {submitting ? "Confirming payment..." : "Pay securely"}
        </Button>
      </form>
    </SurfaceCard>
  );
}
