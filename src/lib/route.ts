export async function resolveRouteInput<T>(input: Promise<T> | T): Promise<T> {
  return Promise.resolve(input);
}

export function readSearchParam(
  value: string | string[] | undefined,
  fallback = "",
) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}
