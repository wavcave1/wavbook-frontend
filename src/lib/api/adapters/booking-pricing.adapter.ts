import { publicApi } from "@/lib/api/endpoints/public-api";
import { placeholderDepositPreview } from "@/lib/mocks/dashboard";
import type { BookingPricingPreview, Duration, PaymentType } from "@/types/api";

export async function getBookingPricingPreview(input: {
  date?: string;
  service: Duration;
  paymentType: PaymentType;
}): Promise<BookingPricingPreview> {
  const prices = await publicApi.getPrices(input.date);
  const fullPrice = prices[input.service];

  if (input.paymentType === "full") {
    return { fullPrice, paymentTypePrice: fullPrice };
  }

  return {
    fullPrice,
    ...placeholderDepositPreview,
  };
}
