import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Darkens a hex color by subtracting `amount` from each RGB channel
 * (clamped at 0), returning an `rgb(...)` string.
 */
export function darkenHex(hex: string, amount: number) {
  let normalizedHex = hex.replace('#', '');
  if (normalizedHex.length === 3) {
    normalizedHex = normalizedHex.split('').map(ch => ch + ch).join('');
  }

  const num = parseInt(normalizedHex, 16);
  const r = Math.max(0, ((num >> 16) & 255) - amount);
  const g = Math.max(0, ((num >> 8) & 255) - amount);
  const b = Math.max(0, (num & 255) - amount);

  return `rgb(${r},${g},${b})`;
}

