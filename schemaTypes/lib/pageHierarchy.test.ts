import {describe, expect, it} from 'vitest'
import type {ValidationContext} from 'sanity'
import {validatePageParent} from './pageHierarchy'

function contextFor(documentId: string, parents: Record<string, string | undefined>) {
  return {
    document: {_id: documentId},
    getClient: () => ({
      fetch: async (_query: string, params: {id: string}) => parents[params.id],
    }),
  } as unknown as ValidationContext
}

describe('validatePageParent', () => {
  it('accepts an empty parent', async () => {
    await expect(validatePageParent(undefined, contextFor('page-a', {}))).resolves.toBe(true)
  })

  it('accepts a valid ancestor chain', async () => {
    const context = contextFor('page-a', {'page-b': 'page-c', 'page-c': undefined})

    await expect(validatePageParent({_ref: 'page-b'} as never, context)).resolves.toBe(true)
  })

  it('rejects a page that is its own parent', async () => {
    const context = contextFor('drafts.page-a', {})

    await expect(validatePageParent({_ref: 'page-a'} as never, context)).resolves.toBe(
      'A page cannot be its own parent.',
    )
  })

  it('rejects a parent that descends from the current page', async () => {
    const context = contextFor('page-a', {'page-b': 'page-c', 'page-c': 'page-a'})

    await expect(validatePageParent({_ref: 'page-b'} as never, context)).resolves.toBe(
      'This would create a circular page hierarchy.',
    )
  })

  it('rejects an existing cycle in the ancestor chain', async () => {
    const context = contextFor('page-a', {'page-b': 'page-c', 'page-c': 'page-b'})

    await expect(validatePageParent({_ref: 'page-b'} as never, context)).resolves.toBe(
      'This would create a circular page hierarchy.',
    )
  })
})
