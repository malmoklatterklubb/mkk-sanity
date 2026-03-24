import {SparklesIcon} from '@sanity/icons'
import {Box, Button, Flex, Stack, TextInput} from '@sanity/ui'
import React, {useCallback, useEffect, useMemo} from 'react'
import {set, unset, useFormValue, type StringInputProps} from 'sanity'
import {computeEventTitle} from '../lib/eventCategories'
import z from 'zod'

const categorySchema = z.string().optional()
const eventPartSchema = z.object({_key: z.string().optional(), start: z.string().optional()})
const eventPartsSchema = z.array(eventPartSchema).optional()

export function AutoTitleInput(props: StringInputProps) {
  const {value, onChange, readOnly, elementProps} = props

  const category = categorySchema.parse(useFormValue(['category']))
  const parts = eventPartsSchema.parse(useFormValue(['parts']))

  const firstStart = parts?.[0]?.start

  const computedTitle = useMemo(
    () => computeEventTitle(category, firstStart),
    [category, firstStart],
  )

  // Auto-fill when the field is empty and a computed title becomes available
  useEffect(() => {
    if (!value && computedTitle) {
      onChange(set(computedTitle))
    }
    // Only re-run when the computed title changes — intentionally omitting
    // `value` and `onChange` to avoid overriding mid-edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computedTitle])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.currentTarget.value
      onChange(val ? set(val) : unset())
    },
    [onChange],
  )

  const handleGenerate = useCallback(() => {
    if (computedTitle) onChange(set(computedTitle))
  }, [computedTitle, onChange])

  const isUncategorized = !category
  const showGenerate = !isUncategorized && Boolean(computedTitle) && !readOnly

  return (
    <Stack space={2}>
      <Flex align="center" gap={2}>
        <Box flex={1}>
          <TextInput
            {...elementProps}
            value={value ?? ''}
            onChange={handleChange}
            readOnly={readOnly}
            placeholder={
              isUncategorized ?
                'Set a category to auto-generate, or enter a title manually'
              : (computedTitle ?? 'Set a date to auto-generate')
            }
          />
        </Box>
        {showGenerate && (
          <Button
            type="button"
            mode="ghost"
            tone="primary"
            icon={SparklesIcon}
            text="Generate"
            onClick={handleGenerate}
          />
        )}
      </Flex>
    </Stack>
  )
}
