export const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

export const formatCurrency = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Quoted at checkout";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDateTime = (value?: string | null, options?: Intl.DateTimeFormatOptions) => {
  if (!value) return "TBD";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...options,
  }).format(new Date(value));
};

export const formatDate = (value?: string | null) =>
  formatDateTime(value, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const slugToLabel = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");

export const startOfDayIso = (value: string) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

export const endOfDayIso = (value: string) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

export const getInitials = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
