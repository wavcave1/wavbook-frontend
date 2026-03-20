"use client";

import { cn } from "@/lib/utils";
import type { BookingSlot } from "@/features/public/booking-flow";

interface TimeSlotPickerProps {
  groups: Array<[string, BookingSlot[]]>;
  selectedTime: string;
  onSelect: (value: string) => void;
  loading?: boolean;
}

export function TimeSlotPicker({
  groups,
  selectedTime,
  onSelect,
  loading = false,
}: TimeSlotPickerProps) {
  if (loading) {
    return <p className="muted-copy">Loading backend availability…</p>;
  }

  return (
    <div className="time-slot-group-stack">
      {groups.map(([label, slots]) => {
        const availableSlots = slots.filter((slot) => slot.available);
        if (!availableSlots.length) return null;

        return (
          <div className="time-slot-group" key={label}>
            <span className="time-slot-group-title">{label}</span>
            <div className="time-slot-grid">
              {availableSlots.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  className={cn(
                    "time-slot-button",
                    selectedTime === slot.value && "time-slot-button-active",
                  )}
                  onClick={() => onSelect(slot.value)}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
