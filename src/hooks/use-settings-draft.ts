"use client";

import { useState } from "react";

interface DraftState<T> {
  snapshot: string;
  baseline: T | null;
  draft: T | null;
}

export function useSettingsDraft<T extends object>(initialValue: T | null) {
  const snapshot = JSON.stringify(initialValue ?? null);
  const [state, setState] = useState<DraftState<T>>({
    snapshot,
    baseline: initialValue,
    draft: initialValue,
  });

  const resolvedState =
    state.snapshot === snapshot
      ? state
      : {
          snapshot,
          baseline: initialValue,
          draft: initialValue,
        };

  const getCurrentState = (current: DraftState<T>): DraftState<T> =>
    current.snapshot === snapshot
      ? current
      : {
          snapshot,
          baseline: initialValue,
          draft: initialValue,
        };

  const updateField = <K extends keyof T>(key: K, value: T[K]) => {
    setState((current) => {
      const nextState = getCurrentState(current);

      return {
        ...nextState,
        draft: {
          ...((nextState.draft ?? nextState.baseline ?? {}) as T),
          [key]: value,
        },
      };
    });
  };

  const resetDraft = () => {
    setState((current) => {
      const nextState = getCurrentState(current);

      return {
        ...nextState,
        draft: nextState.baseline,
      };
    });
  };

  const markSaved = (nextValue: T) => {
    const nextSnapshot = JSON.stringify(nextValue);
    setState({
      snapshot: nextSnapshot,
      baseline: nextValue,
      draft: nextValue,
    });
  };

  const isDirty =
    JSON.stringify(resolvedState.draft ?? null) !==
    JSON.stringify(resolvedState.baseline ?? null);

  return {
    draft: resolvedState.draft,
    isDirty,
    markSaved,
    resetDraft,
    updateField,
  };
}
