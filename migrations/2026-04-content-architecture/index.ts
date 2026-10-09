import {at, defineMigration, setIfMissing} from 'sanity/migrate'

type LegacyDocument = {
  _type?: string
  body?: unknown
  name?: unknown
  firstName?: unknown
  lastName?: unknown
}

function fullName(document: LegacyDocument): string | undefined {
  if (typeof document.name === 'string' && document.name.trim()) return document.name

  const name = [document.firstName, document.lastName]
    .filter((value): value is string => typeof value === 'string' && Boolean(value.trim()))
    .join(' ')

  return name || undefined
}

export default defineMigration({
  title: 'Move editorial content to the revised architecture',
  documentTypes: ['page', 'post', 'person'],
  migrate: {
    document(document) {
      const legacy = document as LegacyDocument
      const patches = []

      if ((legacy._type === 'page' || legacy._type === 'post') && legacy.body !== undefined) {
        patches.push(at('content', setIfMissing(legacy.body)))
      }

      if (legacy._type === 'person') {
        const name = fullName(legacy)
        if (name) patches.push(at('name', setIfMissing(name)))
      }

      return patches
    },
  },
})
