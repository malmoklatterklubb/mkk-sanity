import {at, defineMigration, set} from 'sanity/migrate'

type DocumentValue = Record<string, unknown>
type PortableTextValue = unknown[]

function isObject(value: unknown): value is DocumentValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isLocalizedItem(value: unknown): value is DocumentValue {
  return (
    isObject(value) &&
    (value._key === 'sv' ||
      value._key === 'en' ||
      value.language === 'sv' ||
      value.language === 'en') &&
    (typeof value.value !== 'undefined' ||
      (typeof value._type === 'string' && value._type.startsWith('internationalizedArray')))
  )
}

function isLocalized(value: unknown): boolean {
  return Array.isArray(value) && value.some(isLocalizedItem)
}

function localize(value: unknown): unknown[] | undefined {
  if (value === undefined || isLocalized(value)) return undefined
  return [{_key: 'sv', value}]
}

function localizePortableText(value: unknown): unknown[] | undefined {
  if (!Array.isArray(value)) return undefined

  const localizeBlock = (block: unknown) => {
    if (!isObject(block) || block._type !== 'image') return block

    const image = {...block}
    const alt = localize(image.alt)
    const caption = localize(image.caption)

    if (alt) image.alt = alt
    if (caption) image.caption = caption
    return image
  }

  const localizedItems = value.filter(isLocalizedItem)
  const legacyBlocks = value.filter((item) => !isLocalizedItem(item)).map(localizeBlock)

  if (legacyBlocks.length === 0) return undefined

  const swedishIndex = localizedItems.findIndex(
    (item) => item._key === 'sv' || item.language === 'sv',
  )
  if (swedishIndex >= 0) {
    return localizedItems.map((item, index) =>
      index === swedishIndex && Array.isArray(item.value) ?
        {...item, value: [...legacyBlocks, ...item.value]}
      : item,
    )
  }

  return [...localizedItems, {_key: 'sv', value: legacyBlocks as PortableTextValue}]
}

function localizeSlug(value: unknown): DocumentValue | undefined {
  if (!isObject(value)) return undefined

  if ('sv' in value || 'en' in value) {
    return value._type === 'localeSlug' ? undefined : {_type: 'localeSlug', ...value}
  }

  return typeof value.current === 'string' ? {_type: 'localeSlug', sv: value} : undefined
}

function localizeNavigation(value: unknown): unknown[] | undefined {
  if (!Array.isArray(value)) return undefined

  let changed = false
  const items = value.map((item) => {
    if (!isObject(item)) return item

    const next = {...item}
    const label = localize(next.label)
    const children = localizeNavigation(next.children)

    if (label) {
      next.label = label
      changed = true
    }
    if (children) {
      next.children = children
      changed = true
    }

    return next
  })

  return changed ? items : undefined
}

function pushLocalized(patches: ReturnType<typeof at>[], path: string, value: unknown) {
  const localized = localize(value)
  if (localized) patches.push(at(path, set(localized)))
}

function pushLocalizedPortableText(patches: ReturnType<typeof at>[], path: string, value: unknown) {
  const localized = localizePortableText(value)
  if (localized) patches.push(at(path, set(localized)))
}

function pushLocalizedImageAlt(patches: ReturnType<typeof at>[], path: string, value: unknown) {
  if (!isObject(value)) return
  pushLocalized(patches, `${path}.alt`, value.alt)
}

export default defineMigration({
  title: 'Move Swedish content into field-level localized values',
  documentTypes: [
    'config',
    'homePage',
    'page',
    'person',
    'post',
    'role',
    'section',
    'siteSettings',
  ],
  migrate: {
    document(document) {
      const value = document as DocumentValue
      const patches: ReturnType<typeof at>[] = []

      if (value._type === 'config' || value._type === 'siteSettings') {
        pushLocalized(patches, 'siteTitle', value.siteTitle)
        pushLocalized(patches, 'siteDescription', value.siteDescription)

        const navigation = localizeNavigation(value.navigation)
        if (navigation) patches.push(at('navigation', set(navigation)))
      }

      if (value._type === 'homePage') {
        pushLocalized(patches, 'title', value.title)
        pushLocalized(patches, 'introduction', value.introduction)
        pushLocalizedPortableText(patches, 'content', value.content)
      }

      if (value._type === 'page' || value._type === 'post') {
        pushLocalized(patches, 'title', value.title)
        pushLocalized(patches, 'introduction', value.introduction)
        pushLocalized(patches, 'excerpt', value.excerpt)

        const content = value.content ?? value.body
        pushLocalizedPortableText(patches, 'content', content)

        const slug = localizeSlug(value.slug)
        if (slug) patches.push(at('slug', set(slug)))

        pushLocalizedImageAlt(
          patches,
          value._type === 'page' ? 'featuredImage' : 'mainImage',
          value._type === 'page' ? value.featuredImage : value.mainImage,
        )
      }

      if (value._type === 'person') {
        pushLocalized(patches, 'bio', value.bio)
        pushLocalizedImageAlt(patches, 'image', value.image)
      }

      if (value._type === 'section') {
        pushLocalized(patches, 'title', value.title)
        pushLocalizedPortableText(patches, 'description', value.description)
        pushLocalizedPortableText(patches, 'recruitmentInfo', value.recruitmentInfo)

        const slug = localizeSlug(value.slug)
        if (slug) patches.push(at('slug', set(slug)))
      }

      if (value._type === 'role') {
        pushLocalized(patches, 'title', value.title)
        pushLocalized(patches, 'description', value.description)
      }

      const seo = isObject(value.seo) ? value.seo : undefined
      if (seo) {
        pushLocalized(patches, 'seo.title', seo.title)
        pushLocalized(patches, 'seo.description', seo.description)
        pushLocalizedImageAlt(patches, 'seo.image', seo.image)
      }

      return patches
    },
  },
})
