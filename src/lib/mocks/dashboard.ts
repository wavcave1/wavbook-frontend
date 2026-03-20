import type {
  BookingPricingPreview,
  DashboardInsightPlaceholder,
} from "@/types/api";

export const placeholderDashboardInsights: DashboardInsightPlaceholder = {
  title: "Analytics adapter pending",
  message:
    "This card is backed by a placeholder adapter until a dedicated analytics endpoint exists on the backend.",
  actions: [
    "Use bookings and blocks endpoints for operational views today.",
    "Swap this adapter for a real metrics API when available.",
  ],
};

export const placeholderDepositPreview: BookingPricingPreview = {
  paymentTypePrice: null,
  note:
    "Deposit totals are resolved by the payment intent endpoint. A public quote endpoint can replace this placeholder later.",
};
