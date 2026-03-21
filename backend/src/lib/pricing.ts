export const durationMinutes = {
  '2hr': 120,
  '4hr': 240,
  '8hr': 480,
  '12hr': 720,
} as const;

export type DurationKey = keyof typeof durationMinutes;

export const basePriceMap: Record<DurationKey, number> = {
  '2hr': 12000,
  '4hr': 22000,
  '8hr': 40000,
  '12hr': 56000,
};

export const getPriceMap = (date?: Date) => {
  const day = date?.getUTCDay();
  const multiplier = day === 5 || day === 6 ? 1.15 : 1;

  return Object.fromEntries(
    Object.entries(basePriceMap).map(([key, cents]) => [key, Math.round(cents * multiplier) / 100]),
  ) as Record<DurationKey, number>;
};

export const getChargeAmounts = (duration: DurationKey, paymentType: 'full' | 'deposit', date?: Date) => {
  const fullAmountCents = Math.round(basePriceMap[duration] * ((date?.getUTCDay() === 5 || date?.getUTCDay() === 6) ? 1.15 : 1));
  const amountDueNowCents = paymentType === 'deposit' ? Math.round(fullAmountCents * 0.3) : fullAmountCents;
  return { fullAmountCents, amountDueNowCents };
};
