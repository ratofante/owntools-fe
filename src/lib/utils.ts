import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'
import type { TargetWeightUnit } from '@/types/routine'

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
  return seconds === 0 ? `${minutes}'` : `${minutes}'${seconds}"`
}

export function formatWeight(weight: string | number, unit?: TargetWeightUnit) {
  const value = parseFloat(String(weight))
  return `${value} ${unit ?? ''}`
}

export function getInitials(fullName: string) {
  return fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}
