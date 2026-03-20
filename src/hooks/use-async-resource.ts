"use client";

import { useEffect, useEffectEvent, useState } from "react";

interface AsyncResourceState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useAsyncResource<T>(
  loader: () => Promise<T>,
  dependencyKey: string,
) {
  const [state, setState] = useState<AsyncResourceState<T>>({
    data: null,
    error: null,
    loading: true,
  });
  const runLoader = useEffectEvent(loader);

  useEffect(() => {
    let active = true;

    Promise.resolve()
      .then(async () => {
        if (!active) return;

        setState((current) => ({
          ...current,
          loading: true,
          error: null,
        }));

        const data = await runLoader();
        if (!active) return;

        setState({
          data,
          error: null,
          loading: false,
        });
      })
      .catch((error: unknown) => {
        if (!active) return;

        setState({
          data: null,
          error: error instanceof Error ? error.message : "Unknown error",
          loading: false,
        });
      });

    return () => {
      active = false;
    };
  }, [dependencyKey]);

  return state;
}
