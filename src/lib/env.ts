const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const env = {
  apiBaseUrl: trimTrailingSlash(
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://wav-book-backend-production.up.railway.app",
  ),
  stripePublishableKey:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51TCu6oDisNngObmPMjpCeoBnScBEMTds1xpOXcSUcDSDy8npxeuk4vUEHnnDHnp5vMoJPdx56Z4gmpIIuAyzDCf000Q5pj7Jp9",
};
