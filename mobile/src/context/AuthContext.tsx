import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { mobileConfig } from '@/utils/config';

const discovery = {
  authorizationEndpoint: `https://${mobileConfig.auth0Domain}/authorize`,
  tokenEndpoint: `https://${mobileConfig.auth0Domain}/oauth/token`,
  revocationEndpoint: `https://${mobileConfig.auth0Domain}/oauth/revoke`,
};

interface AuthContextValue {
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (screenHint?: 'login' | 'signup') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const storageKey = 'wavbook.mobile.access-token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(storageKey)
      .then((token) => setAccessToken(token))
      .finally(() => setLoading(false));
  }, []);

  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'wavbook' });

  const signIn = useCallback(async (screenHint: 'login' | 'signup' = 'login') => {
    const request = new AuthSession.AuthRequest({
      clientId: mobileConfig.auth0ClientId,
      scopes: mobileConfig.auth0Scope.split(' '),
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
      extraParams: {
        audience: mobileConfig.auth0Audience,
        screen_hint: screenHint,
      },
    });

    const response = await request.promptAsync(discovery);
    if (response.type !== 'success') return;

    const result = await AuthSession.exchangeCodeAsync(
      {
        clientId: mobileConfig.auth0ClientId,
        code: response.params.code,
        redirectUri,
        extraParams: {
          code_verifier: request.codeVerifier ?? '',
        },
      },
      discovery,
    );

    setAccessToken(result.accessToken);
    await SecureStore.setItemAsync(storageKey, result.accessToken);
  }, [redirectUri]);

  const signOut = useCallback(async () => {
    setAccessToken(null);
    await SecureStore.deleteItemAsync(storageKey);
    const logoutUrl = `https://${mobileConfig.auth0Domain}/v2/logout?client_id=${mobileConfig.auth0ClientId}&returnTo=${encodeURIComponent(redirectUri)}`;
    await Linking.openURL(logoutUrl);
  }, [redirectUri]);

  const value = useMemo(
    () => ({ accessToken, isAuthenticated: Boolean(accessToken), loading, signIn, signOut }),
    [accessToken, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
