import { env } from '@/lib/env';
import { getStoredAccessToken } from '@/lib/auth/auth-client';

type QueryValue = string | number | boolean | null | undefined;

export interface ApiErrorShape {
  error?: string;
  details?: string[];
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  query?: Record<string, QueryValue>;
  body?: unknown;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
  token?: string;
}

const buildUrl = (path: string, query?: Record<string, QueryValue>) => {
  const url = new URL(path, env.apiBaseUrl);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });

  return url.toString();
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { query, body, headers, token, ...rest } = options;
  const resolvedToken = token ?? (typeof window !== 'undefined' ? getStoredAccessToken() : null);

  const response = await fetch(buildUrl(path, query), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
      ...(headers ?? {}),
    },
    credentials: rest.credentials ?? 'include',
    cache: rest.cache ?? 'no-store',
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    let message = 'Request failed';

    try {
      const payload = (await response.json()) as ApiErrorShape;
      message = payload.details?.length
        ? `${payload.error ?? message}: ${payload.details.join(', ')}`
        : (payload.error ?? message);
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
