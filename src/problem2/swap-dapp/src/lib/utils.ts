import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(value: number | string) {
  return parseFloat((`${value}` || "0").replace(/,/g, "")).toLocaleString(
    "en",
    {
      maximumFractionDigits: 8,
    }
  );
}
