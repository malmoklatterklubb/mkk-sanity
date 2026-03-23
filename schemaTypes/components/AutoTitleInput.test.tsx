// @vitest-environment jsdom
import {fireEvent, render, screen} from '@testing-library/react'
import React from 'react'
import {type StringInputProps, useFormValue} from 'sanity'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {AutoTitleInput} from './AutoTitleInput'

// Mocks — implementations live in __mocks__/ next to node_modules
vi.mock('@sanity/ui')
vi.mock('@sanity/icons')
vi.mock('sanity')

type EventPart = {_key?: string; start?: string}

/**
 * Configures the useFormValue mock to return the given category and parts for
 * the current test. Pass no arguments to simulate an unconfigured document.
 */
function setupFormValues(category?: string, parts?: EventPart[]) {
  vi.mocked(useFormValue).mockImplementation((path: unknown) => {
    const [field] = path as string[]
    if (field === 'category') return category
    if (field === 'parts') return parts
    return undefined
  })
}

/**
 * Builds a minimal set of StringInputProps. Override only what each test needs.
 */
function makeProps(overrides?: {
  value?: string
  onChange?: ReturnType<typeof vi.fn>
  readOnly?: boolean
}): StringInputProps {
  return {
    value: overrides?.value,
    onChange: overrides?.onChange ?? vi.fn(),
    readOnly: overrides?.readOnly ?? false,
    elementProps: {
      id: 'test-title',
      onBlur: vi.fn(),
      onFocus: vi.fn(),
    },
  } as unknown as StringInputProps
}

describe('AutoTitleInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('auto-fill', () => {
    it('calls onChange with the computed title when the field is empty and a computed title is available', () => {
      setupFormValues('topprepskurs', [{start: '2025-01-06T12:00:00.000Z'}])
      const onChange = vi.fn()

      render(<AutoTitleInput {...makeProps({onChange})} />)

      expect(onChange).toHaveBeenCalledWith({_patch: 'set', value: 'Topprepskurs v. 2'})
    })

    it('does not call onChange when the field already has a value', () => {
      setupFormValues('topprepskurs', [{start: '2025-01-06T12:00:00.000Z'}])
      const onChange = vi.fn()

      render(<AutoTitleInput {...makeProps({value: 'My custom title', onChange})} />)

      expect(onChange).not.toHaveBeenCalled()
    })

    it('does not call onChange when no category is set', () => {
      setupFormValues(undefined, [{start: '2025-01-06T12:00:00.000Z'}])
      const onChange = vi.fn()

      render(<AutoTitleInput {...makeProps({onChange})} />)

      expect(onChange).not.toHaveBeenCalled()
    })

    it('does not call onChange when no parts are set', () => {
      setupFormValues('topprepskurs', [])
      const onChange = vi.fn()

      render(<AutoTitleInput {...makeProps({onChange})} />)

      expect(onChange).not.toHaveBeenCalled()
    })

    it('does not call onChange when parts have no start date', () => {
      setupFormValues('topprepskurs', [{_key: 'abc'}])
      const onChange = vi.fn()

      render(<AutoTitleInput {...makeProps({onChange})} />)

      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('Generate button', () => {
    it('is visible when a computed title is available and the field is not read-only', () => {
      setupFormValues('topprepskurs', [{start: '2025-01-06T12:00:00.000Z'}])

      render(<AutoTitleInput {...makeProps()} />)

      expect(screen.getByRole('button', {name: /generate/i})).toBeInTheDocument()
    })

    it('is hidden when no category is set', () => {
      setupFormValues(undefined, [{start: '2025-01-06T12:00:00.000Z'}])

      render(<AutoTitleInput {...makeProps()} />)

      expect(screen.queryByRole('button', {name: /generate/i})).not.toBeInTheDocument()
    })

    it('is hidden when the field is read-only', () => {
      setupFormValues('topprepskurs', [{start: '2025-01-06T12:00:00.000Z'}])

      render(<AutoTitleInput {...makeProps({readOnly: true})} />)

      expect(screen.queryByRole('button', {name: /generate/i})).not.toBeInTheDocument()
    })

    it('is hidden when a category is set but no start date is available', () => {
      setupFormValues('topprepskurs', [])

      render(<AutoTitleInput {...makeProps()} />)

      expect(screen.queryByRole('button', {name: /generate/i})).not.toBeInTheDocument()
    })

    it('calls onChange with the computed title when clicked', () => {
      setupFormValues('ledkurs', [{start: '2025-01-06T12:00:00.000Z'}])
      const onChange = vi.fn()
      // Pre-set a value so auto-fill does not trigger and pollute the assertion
      render(<AutoTitleInput {...makeProps({value: 'Old title', onChange})} />)

      fireEvent.click(screen.getByRole('button', {name: /generate/i}))

      expect(onChange).toHaveBeenCalledWith({_patch: 'set', value: 'Ledkurs v. 2'})
    })

    it('overwrites an existing manual title when clicked', () => {
      setupFormValues('prova-pa', [{start: '2025-01-06T12:00:00.000Z'}])
      const onChange = vi.fn()
      render(<AutoTitleInput {...makeProps({value: 'Something completely different', onChange})} />)

      fireEvent.click(screen.getByRole('button', {name: /generate/i}))

      expect(onChange).toHaveBeenCalledWith({_patch: 'set', value: 'Prova på v. 2'})
    })
  })

  describe('text input', () => {
    it('calls onChange with a set patch when the user types', () => {
      setupFormValues()
      const onChange = vi.fn()
      render(<AutoTitleInput {...makeProps({onChange})} />)

      fireEvent.change(screen.getByRole('textbox'), {target: {value: 'My new title'}})

      expect(onChange).toHaveBeenCalledWith({_patch: 'set', value: 'My new title'})
    })

    it('calls onChange with an unset patch when the user clears the field', () => {
      setupFormValues()
      const onChange = vi.fn()
      render(<AutoTitleInput {...makeProps({value: 'Existing title', onChange})} />)

      fireEvent.change(screen.getByRole('textbox'), {target: {value: ''}})

      expect(onChange).toHaveBeenCalledWith({_patch: 'unset'})
    })
  })

  describe('placeholder text', () => {
    it('shows the uncategorized hint when no category is set', () => {
      setupFormValues(undefined)

      render(<AutoTitleInput {...makeProps()} />)

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'placeholder',
        'Set a category to auto-generate, or enter a title manually',
      )
    })

    it('shows the date hint when a category is set but no start date is available', () => {
      setupFormValues('uppklattring', [])

      render(<AutoTitleInput {...makeProps()} />)

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'placeholder',
        'Set a date to auto-generate',
      )
    })

    it('uses the computed title as the placeholder when category and start date are both set', () => {
      // Provide a pre-existing value so the field is not empty; auto-fill will
      // not overwrite it and the computed title remains visible as a placeholder.
      setupFormValues('topprepskurs', [{start: '2025-01-06T12:00:00.000Z'}])

      render(<AutoTitleInput {...makeProps({value: 'Manual override'})} />)

      expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Topprepskurs v. 2')
    })
  })
})
