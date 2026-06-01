export const BOOKING_URL = 'https://calendar.app.google/fmmWP5xGeUGfjYYp6'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `£${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `£${(num / 1_000).toFixed(0)}K`
  return `£${num}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
