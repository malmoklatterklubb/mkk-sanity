import type {SanityDocument} from 'sanity'

export const supportedLanguages = [
  {id: 'sv', title: 'Swedish'},
  {id: 'en', title: 'English'},
]

export const localizedDocumentTypes = [
  'homePage',
  'page',
  'post',
  'person',
  'role',
  'section',
  'siteSettings',
]

type InternationalizedValue = {
  _key?: string
  language?: string
  value?: unknown
}

export function getLocalizedValue(value: unknown, language = 'sv'): string | undefined {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return undefined

  const localizedValue = value.find(
    (item): item is InternationalizedValue =>
      typeof item === 'object' &&
      item !== null &&
      ('_key' in item || 'language' in item) &&
      (item._key === language || item.language === language),
  )

  return typeof localizedValue?.value === 'string' ? localizedValue.value : undefined
}

export function sourceLocalizedSlug(language: 'sv' | 'en') {
  return (document: SanityDocument) =>
    getLocalizedValue((document as SanityDocument & {title?: unknown}).title, language) ?? ''
}

export function hasLocalizedValue(value: unknown, language = 'sv') {
  return getLocalizedValue(value, language) !== undefined
}

export function validateLocalizedImageAlt(value: unknown, parent: unknown) {
  const hasAsset =
    typeof parent === 'object' && parent !== null && 'asset' in parent && Boolean(parent.asset)

  return !hasAsset || hasLocalizedValue(value) || 'Add Swedish alternative text for this image.'
}
