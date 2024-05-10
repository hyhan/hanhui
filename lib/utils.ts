import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toSlashDateString = (date: number | Date) => {
  return dayjs(date).locale('zh-cn').format('YYYY年M月D日 dddd HH:mm:ss')
}
