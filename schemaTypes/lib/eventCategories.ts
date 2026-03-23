export const eventCategories = [
  {title: 'Topprepskurs', value: 'topprepskurs'},
  {title: 'Ledkurs', value: 'ledkurs'},
  {title: 'Uppklättring', value: 'uppklattring'},
  {title: 'Prova på', value: 'prova-pa'},
] as const

export type EventCategoryValue = (typeof eventCategories)[number]['value']

/** Returns the ISO 8601 week number for a given date. */
export function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const dayOfWeek = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayOfWeek)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

/**
 * Computes the auto-generated event title from a category value and a start
 * date string. Returns null when the category is null/undefined (uncategorized)
 * or inputs are missing.
 */
export function computeEventTitle(
  category: string | undefined,
  firstStart: string | undefined,
): string | null {
  if (!category || !firstStart) return null
  const entry = eventCategories.find((c) => c.value === category)
  if (!entry) return null
  return `${entry.title} v. ${getISOWeek(new Date(firstStart))}`
}
