import { format, formatDistanceToNow, isAfter, isBefore, parseISO, differenceInDays } from "date-fns";

export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return "—";
  try {
    return format(parseISO(isoString), "MMM d, yyyy");
  } catch {
    return "—";
  }
}

export function formatDateShort(isoString: string | null | undefined): string {
  if (!isoString) return "—";
  try {
    return format(parseISO(isoString), "MMM d");
  } catch {
    return "—";
  }
}

export function formatRelative(isoString: string | null | undefined): string {
  if (!isoString) return "—";
  try {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
  } catch {
    return "—";
  }
}

export function formatCurrency(inr: number | null | undefined): string {
  if (inr == null) return "—";
  return new Intl.NumberFormat("en-in", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(inr);
}

export function formatPct(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${Math.round(value)}%`;
}

export function formatHours(hours: number | null | undefined): string {
  if (hours == null) return "—";
  if (hours === 0) return "0h";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  return `${hours % 1 === 0 ? hours : hours.toFixed(1)}h`;
}

export function isOverdue(expectedReturnDate: string | null | undefined): boolean {
  if (!expectedReturnDate) return false;
  return isBefore(parseISO(expectedReturnDate), new Date());
}

export function isDueSoon(expectedReturnDate: string | null | undefined, withinDays = 2): boolean {
  if (!expectedReturnDate) return false;
  const date = parseISO(expectedReturnDate);
  const now = new Date();
  return isAfter(date, now) && differenceInDays(date, now) <= withinDays;
}

export function getDaysOverdue(expectedReturnDate: string | null | undefined): number {
  if (!expectedReturnDate) return 0;
  const diff = differenceInDays(new Date(), parseISO(expectedReturnDate));
  return Math.max(0, diff);
}

export function getDaysRemaining(expectedReturnDate: string | null | undefined): number {
  if (!expectedReturnDate) return 0;
  const diff = differenceInDays(parseISO(expectedReturnDate), new Date());
  return Math.max(0, diff);
}
