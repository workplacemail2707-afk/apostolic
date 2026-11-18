import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateShort(isoDate: string): string {
  if (!isoDate) return '';
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const SCHOOL_INFO = {
  name: "Apostolic Carmel Girls' Secondary School",
  shortName: 'Apostolic Carmel',
  tagline: 'Seeking the Heights',
  phoneDisplay: '+254 728 502 547',
  phoneHref: 'tel:+254728502547',
  whatsappHref:
    'https://wa.me/254728502547?text=Hello%20Apostolic%20Carmel%20Admissions%2C%20I%20would%20like%20to%20enquire%20about%20admissions.',
  email: 'info@apostoliccarmel.ac.ke',
  addressLine: 'Katulo Road, Buru Buru Phase V, next to Blessed Sacrament Church',
  poBox: 'P.O. Box 1344-00515, Nairobi, Kenya',
  hours: 'Mon – Fri: 7:30 AM – 4:30 PM · Sat (by appointment): 8:30 AM – 12:30 PM',
  registrationFee: 'Ksh 2,500',
  principal: 'Sr. Joanita AC',
};
