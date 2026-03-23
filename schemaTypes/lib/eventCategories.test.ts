import {describe, expect, it} from 'vitest'

import {computeEventTitle, eventCategories, getISOWeek} from './eventCategories'

// ---------------------------------------------------------------------------
// eventCategories constant
// ---------------------------------------------------------------------------

describe('eventCategories', () => {
  const values = eventCategories.map((c) => c.value)
  const titles = eventCategories.map((c) => c.title)

  it('does not include an övrigt / uncategorized entry - null is uncategorized', () => {
    expect(values).not.toContain('ovrigt')
    expect(values).not.toContain('annat')
    expect(values).not.toContain('uncategorized')
    expect(values).not.toContain('other')
  })

  it('every entry has a non-empty title and value', () => {
    for (const category of eventCategories) {
      expect(category.title.length).toBeGreaterThan(0)
      expect(category.value.length).toBeGreaterThan(0)
    }
  })

  it.each(['Topprepskurs', 'Ledkurs', 'Uppklättring', 'Prova på'])(
    'contains crucial category titles',
    (title) => {
      expect(titles).toContain(title)
    },
  )
})

// ---------------------------------------------------------------------------
// getISOWeek
//
// All test dates use T12:00:00.000Z to be unambiguous across timezones.
// The implementation must derive the week from the UTC date — using local-time
// getters (getFullYear etc.) instead of their UTC equivalents would cause
// tests to fail for machines running UTC-offset timezones when the local date
// differs from the UTC date.
// ---------------------------------------------------------------------------

describe('getISOWeek', () => {
  it('returns the correct week for a regular mid-year date (2024-06-12 → 24)', () => {
    expect(getISOWeek(new Date('2024-06-12T12:00:00.000Z'))).toBe(24)
  })

  it('returns 1 for a date that starts the first ISO week of the year (2024-01-01, a Monday)', () => {
    expect(getISOWeek(new Date('2024-01-01T12:00:00.000Z'))).toBe(1)
  })

  it('returns 2 for the second week of 2025 (2025-01-06, a Monday)', () => {
    expect(getISOWeek(new Date('2025-01-06T12:00:00.000Z'))).toBe(2)
  })

  it('assigns a late-December date to week 1 of the following year when its Thursday falls in January (2024-12-30)', () => {
    // 2024-12-30 is a Monday; its Thursday is 2025-01-02 → ISO week 1 of 2025
    expect(getISOWeek(new Date('2024-12-30T12:00:00.000Z'))).toBe(1)
  })

  it('assigns an early-January date to week 52 of the previous year when its Thursday falls in December (2023-01-01)', () => {
    // 2023-01-01 is a Sunday; its Thursday is 2022-12-29 → ISO week 52 of 2022
    expect(getISOWeek(new Date('2023-01-01T12:00:00.000Z'))).toBe(52)
  })

  it('returns 53 for a year that has 53 ISO weeks (2020-12-31)', () => {
    // 2020 is a long year: Dec 31 is a Thursday, fully inside 2020
    expect(getISOWeek(new Date('2020-12-31T12:00:00.000Z'))).toBe(53)
  })

  it('uses the UTC date, not the local date, to determine the week', () => {
    // 2024-12-30T00:30:00.000Z is still 2024-12-30 in UTC (→ week 1 of 2025)
    // but would be 2024-12-29 in any UTC-1 or lower timezone (→ week 52 of 2024).
    // A correct implementation must use UTC getters throughout.
    expect(getISOWeek(new Date('2024-12-30T00:30:00.000Z'))).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// computeEventTitle
// ---------------------------------------------------------------------------

describe('computeEventTitle', () => {
  // --- null / missing inputs ---

  it('returns null when category is undefined', () => {
    expect(computeEventTitle(undefined, '2025-01-06T12:00:00.000Z')).toBeNull()
  })

  it('returns null when firstStart is undefined', () => {
    expect(computeEventTitle('topprepskurs', undefined)).toBeNull()
  })

  it('returns null when both arguments are undefined', () => {
    expect(computeEventTitle(undefined, undefined)).toBeNull()
  })

  it('returns null for an unrecognised category value', () => {
    expect(computeEventTitle('ovrigt', '2025-01-06T12:00:00.000Z')).toBeNull()
    expect(computeEventTitle('unknown', '2025-01-06T12:00:00.000Z')).toBeNull()
  })

  // --- format ---

  it('formats the title as "<category title> v. <week number>"', () => {
    // 2025-01-06 is week 2
    expect(computeEventTitle('topprepskurs', '2025-01-06T12:00:00.000Z')).toBe('Topprepskurs v. 2')
  })

  it.each([...eventCategories])('uses the correct Swedish title for $value', ({title, value}) => {
    // 2025-01-06 is week 2 — we only care that the title label is right here
    const result = computeEventTitle(value, '2025-01-06T12:00:00.000Z')
    expect(result).toBe(`${title} v. 2`)
  })

  // --- week number derivation ---

  it('derives the week number from the firstStart date', () => {
    // 2025-06-11 is week 24, giving a different week than the other tests
    expect(computeEventTitle('ledkurs', '2025-06-11T12:00:00.000Z')).toBe('Ledkurs v. 24')
  })

  it('handles a year-boundary start date where the week belongs to the new year', () => {
    // 2024-12-30 is ISO week 1 of 2025
    expect(computeEventTitle('ledkurs', '2024-12-30T12:00:00.000Z')).toBe('Ledkurs v. 1')
  })

  it('handles a year-boundary start date where the week belongs to the previous year', () => {
    // 2023-01-01 is ISO week 52 of 2022
    expect(computeEventTitle('topprepskurs', '2023-01-01T12:00:00.000Z')).toBe('Topprepskurs v. 52')
  })
})
