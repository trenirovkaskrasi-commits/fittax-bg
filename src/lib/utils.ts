import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, currency: 'EUR' | 'BGN' = 'EUR') => {
  const formatter = new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
};

export const EXCHANGE_RATE = 1.95583;

export const toBGN = (eur: number) => eur * EXCHANGE_RATE;
export const toEUR = (bgn: number) => bgn / EXCHANGE_RATE;
