export const mobileConfig = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000',
  auth0Domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN ?? '',
  auth0ClientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID ?? '',
  auth0Audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE ?? '',
  auth0Scope: 'openid profile email offline_access',
};
