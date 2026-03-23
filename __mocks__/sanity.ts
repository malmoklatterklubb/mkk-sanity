import {vi} from 'vitest'

// Patch helpers return a recognisable shape so test assertions don't depend on
// Sanity's internal patch representation.
export const set = (value: string) => ({_patch: 'set', value})
export const unset = () => ({_patch: 'unset'})

// Spy — configure per-test with vi.mocked(useFormValue).mockImplementation(...)
export const useFormValue = vi.fn()
