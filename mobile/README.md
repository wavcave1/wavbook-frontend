# WAVBOOK Mobile

Expo-based React Native companion app for the existing WAVBOOK web frontend.

## Run locally

1. Copy `.env.example` to `.env`.
2. Set `EXPO_PUBLIC_API_URL` to your backend origin.
3. Set the Auth0 values for your mobile application.
4. Install dependencies with `npm install` from `/mobile`.
5. Start Expo with `npm run start`.

## Included flows

- Marketplace home and browse screens.
- Studio detail pages.
- Booking draft flow that creates backend Stripe payment intents.
- Auth0-powered operator login.
- Operator dashboard membership summary.

## Notes

- The mobile booking flow intentionally adapts the current web Stripe checkout by creating the backend payment intent first. To add full native card entry later, connect Stripe's React Native SDK to the same backend payment-intent endpoint.
- Use the Expo scheme `wavbook://` in your Auth0 allowed callback/logout URLs.
