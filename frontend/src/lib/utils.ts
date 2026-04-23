import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUtcToLocalTime(utcString: string): string {
  const date = new Date(utcString);

  const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';

  return `${get('year')}/${get('month')}/${get('day')} ${get('hour')}:${get('minute')}`;
}
