import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'
import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toSlashDateString = (date: number | Date) => {
  return dayjs(date).locale('zh-cn').format('YYYY年M月D日 dddd HH:mm:ss')
}

export const toSlug = (s: string) => {
  if (!s) {
    return '';
  }

  return slugify(s, {
    lower: true,
  });
};
