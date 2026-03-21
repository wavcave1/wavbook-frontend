const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const env = {
  apiBaseUrl: trimTrailingSlash(
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
  ),
  stripePublishableKey:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  auth0Domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
  auth0ClientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
  auth0Audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || '',
  auth0RedirectUri:
    process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI ||
    (typeof window !== 'undefined' ? `${window.location.origin}/callback` : ''),
};
