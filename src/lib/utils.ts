import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return `יום ${days[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
}

export function formatDateHebrew(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return `${days[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
}

export function getShiftEmoji(shift: string): string {
  switch (shift) {
    case 'morning': return '🌅';
    case 'noon': return '☀️';
    case 'night': return '🌙';
    default: return '';
  }
}
