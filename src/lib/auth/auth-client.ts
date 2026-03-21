const authConfig = {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
  audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || '',
  redirectUri:
    process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI ||
    (typeof window !== 'undefined' ? `${window.location.origin}/callback` : ''),
};

const accessTokenStorageKey = 'wavbook.web.access-token';
const pendingInviteStorageKey = 'wavbook.web.pending-invite';
const pendingStudioStorageKey = 'wavbook.web.pending-studio';

export function getStoredAccessToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(accessTokenStorageKey);
}

export function setStoredAccessToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(accessTokenStorageKey, token);
  } else {
    window.localStorage.removeItem(accessTokenStorageKey);
  }
}

export function setPendingInvite(payload: { inviteCode: string; studioName?: string } | null) {
  if (typeof window === 'undefined') return;
  if (!payload) {
    window.sessionStorage.removeItem(pendingInviteStorageKey);
    window.sessionStorage.removeItem(pendingStudioStorageKey);
    return;
  }

  window.sessionStorage.setItem(pendingInviteStorageKey, payload.inviteCode);
  if (payload.studioName) {
    window.sessionStorage.setItem(pendingStudioStorageKey, payload.studioName);
  } else {
    window.sessionStorage.removeItem(pendingStudioStorageKey);
  }
}

export function getPendingInvite() {
  if (typeof window === 'undefined') return null;
  const inviteCode = window.sessionStorage.getItem(pendingInviteStorageKey);
  if (!inviteCode) return null;
  return {
    inviteCode,
    studioName: window.sessionStorage.getItem(pendingStudioStorageKey) || undefined,
  };
}

export async function startAuthFlow(mode: 'login' | 'signup') {
  if (typeof window === 'undefined') return;
  const url = new URL(`https://${authConfig.domain}/authorize`);
  url.searchParams.set('response_type', 'token');
  url.searchParams.set('client_id', authConfig.clientId);
  url.searchParams.set('redirect_uri', authConfig.redirectUri);
  url.searchParams.set('audience', authConfig.audience);
  url.searchParams.set('scope', 'openid profile email');

  if (mode === 'signup') {
    url.searchParams.set('screen_hint', 'signup');
  }

  window.location.assign(url.toString());
}

export async function completeAuthFlow() {
  if (typeof window === 'undefined') {
    throw new Error('Auth callback requires a browser environment.');
  }

  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;
  const params = new URLSearchParams(hash);
  const token = params.get('access_token');
  const error = params.get('error_description') || params.get('error');

  if (error) {
    throw new Error(error);
  }

  if (!token) {
    throw new Error('Auth0 did not return an access token.');
  }

  setStoredAccessToken(token);
  window.history.replaceState({}, document.title, window.location.pathname);
  return token;
}

export async function logoutFromAuth0() {
  if (typeof window === 'undefined') return;
  setStoredAccessToken(null);
  setPendingInvite(null);
  const url = new URL(`https://${authConfig.domain}/v2/logout`);
  url.searchParams.set('client_id', authConfig.clientId);
  url.searchParams.set('returnTo', `${window.location.origin}/login`);
  window.location.assign(url.toString());
}
