import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

/**
 * Format a time in seconds to a string in the format of "mm:ss"
 * @param time - The time in seconds
 * @returns The formatted time string
 */
export function formatSecondsToTime(time: number) {
  if (time < 60) {
    return `${time}"`
  }
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  return `${minutes}'${seconds}"`
}
