import type { BusyInterval, Duration, PaymentType } from "@/types/api";

export const serviceDurationMinutes: Record<Duration, number> = {
  "2hr": 120,
  "4hr": 240,
  "8hr": 480,
  "12hr": 720,
};

export const serviceOptions: Array<{
  value: Duration;
  label: string;
  description: string;
}> = [
  {
    value: "2hr",
    label: "2 hours",
    description: "Short sessions for vocals, podcasting, and focused tracking.",
  },
  {
    value: "4hr",
    label: "4 hours",
    description: "A standard half-day block for music, photo, or content work.",
  },
  {
    value: "8hr",
    label: "8 hours",
    description: "A full-day session for longer production or rehearsal windows.",
  },
  {
    value: "12hr",
    label: "12 hours",
    description: "Extended lockout time for complex sessions and all-day crews.",
  },
];

export const paymentTypeOptions: Array<{
  value: PaymentType;
  label: string;
  description: string;
}> = [
  {
    value: "full",
    label: "Pay in full",
    description: "Use the secure checkout to pay the backend-calculated amount now.",
  },
  {
    value: "deposit",
    label: "Pay deposit",
    description:
      "If supported for the selected session, the exact amount due is calculated by the backend at checkout.",
  },
];

export interface BookingSlot {
  value: string;
  label: string;
  startIso: string;
  endIso: string;
  available: boolean;
}

export const getDefaultBookingDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toDateInputValue(date);
};

export const toDateInputValue = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

export const buildLocalDateTime = (date: string, time: string) =>
  new Date(`${date}T${time}:00`);

export const buildBookingStartIso = (date: string, time: string) =>
  buildLocalDateTime(date, time).toISOString();

export const buildBookingEndIso = (date: string, time: string, service: Duration) =>
  new Date(
    buildLocalDateTime(date, time).getTime() +
      serviceDurationMinutes[service] * 60 * 1000,
  ).toISOString();

export const buildPricingDateIso = (date: string, time?: string) => {
  const fallbackTime = time || "12:00";
  return buildBookingStartIso(date, fallbackTime);
};

export const buildAvailabilityRange = (date: string) => {
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

const overlaps = (
  startIso: string,
  endIso: string,
  busyIntervals: BusyInterval[],
) => {
  const startTime = new Date(startIso).getTime();
  const endTime = new Date(endIso).getTime();

  return busyIntervals.some((interval) => {
    const busyStart = new Date(interval.start_time).getTime();
    const busyEnd = new Date(interval.end_time).getTime();
    return startTime < busyEnd && endTime > busyStart;
  });
};

export const buildDailySlots = (
  date: string,
  service: Duration,
  busyIntervals: BusyInterval[],
): BookingSlot[] => {
  const slots: BookingSlot[] = [];
  const now = Date.now();

  for (let hour = 0; hour < 24; hour += 1) {
    for (const minute of [0, 30]) {
      const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      const start = buildLocalDateTime(date, value);
      const startIso = start.toISOString();
      const endIso = buildBookingEndIso(date, value, service);

      const available =
        start.getTime() > now && !overlaps(startIso, endIso, busyIntervals);

      slots.push({
        value,
        label: start.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        startIso,
        endIso,
        available,
      });
    }
  }

  return slots;
};

export const groupSlots = (slots: BookingSlot[]) => {
  const groups = new Map<string, BookingSlot[]>();

  for (const slot of slots) {
    const hour = Number(slot.value.slice(0, 2));
    const group =
      hour >= 6 && hour < 12
        ? "Morning"
        : hour >= 12 && hour < 17
          ? "Afternoon"
          : hour >= 17 && hour < 22
            ? "Evening"
            : "Late";

    const items = groups.get(group) ?? [];
    items.push(slot);
    groups.set(group, items);
  }

  return Array.from(groups.entries());
};

export const parsePaymentIntentIdFromClientSecret = (clientSecret: string) =>
  clientSecret.split("_secret_")[0] ?? "";
