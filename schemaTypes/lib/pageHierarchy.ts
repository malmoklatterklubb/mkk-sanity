import type {Reference, ValidationContext} from 'sanity'

function withoutDraftPrefix(id: string) {
  return id.replace(/^drafts\./, '')
}

export async function validatePageParent(
  value: Reference | undefined,
  context: ValidationContext,
): Promise<true | string> {
  const parentRef = value?._ref
  if (!parentRef) return true

  const documentId = context.document?._id
  if (!documentId) return true

  const currentId = withoutDraftPrefix(documentId)
  let ancestorId: string | undefined = withoutDraftPrefix(parentRef)

  if (ancestorId === currentId) {
    return 'A page cannot be its own parent.'
  }

  const client = context.getClient({apiVersion: '2026-10-09'})
  const visited = new Set<string>([currentId])

  while (ancestorId) {
    if (visited.has(ancestorId)) {
      return 'This would create a circular page hierarchy.'
    }

    visited.add(ancestorId)

    const nextAncestorId = (await client.fetch(`*[_id in [$id, $draftId]][0].parent._ref`, {
      id: ancestorId,
      draftId: `drafts.${ancestorId}`,
    })) as string | null

    ancestorId = nextAncestorId ? withoutDraftPrefix(nextAncestorId) : undefined
  }

  return true
}
