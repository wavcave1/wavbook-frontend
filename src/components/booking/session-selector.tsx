"use client";

import { cn } from "@/lib/utils";

interface SessionSelectorOption<T extends string> {
  value: T;
  label: string;
  description: string;
}

interface SessionSelectorProps<T extends string> {
  title: string;
  value: T;
  options: Array<SessionSelectorOption<T>>;
  onChange: (value: T) => void;
}

export function SessionSelector<T extends string>({
  title,
  value,
  options,
  onChange,
}: SessionSelectorProps<T>) {
  return (
    <div className="booking-selector-block">
      <span className="eyebrow">{title}</span>
      <div className="booking-selector-grid">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(
              "booking-selector-card",
              value === option.value && "booking-selector-card-active",
            )}
            onClick={() => onChange(option.value)}
          >
            <strong>{option.label}</strong>
            <p>{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
