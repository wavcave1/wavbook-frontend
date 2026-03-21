import { mobileConfig } from '@/utils/config';

export type QueryValue = string | number | boolean | null | undefined;

const buildUrl = (path: string, query?: Record<string, QueryValue>) => {
  const url = new URL(path, mobileConfig.apiUrl);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });
  return url.toString();
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { query?: Record<string, QueryValue>; token?: string; body?: unknown } = {},
): Promise<T> {
  const { query, token, body, headers, ...rest } = options;
  const response = await fetch(buildUrl(path, query), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(payload.error ?? 'Request failed');
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
