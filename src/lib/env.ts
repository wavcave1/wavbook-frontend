const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const env = {
  apiBaseUrl: trimTrailingSlash(
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  ),
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
};
