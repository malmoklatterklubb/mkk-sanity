import {defineField, defineType} from 'sanity'
import {sourceLocalizedSlug} from '../lib/localization'

function isUniqueSlug(language: 'sv' | 'en') {
  return async (
    value: string,
    context: {document?: {_id?: string; _type?: string}; getClient: Function},
  ) => {
    if (!value) return true

    const id = context.document?._id?.replace(/^drafts\./, '')
    const type = context.document?._type
    if (!id || !type) return true

    const client = context.getClient({apiVersion: '2026-10-09'})
    const isUnique = await client.fetch(
      `count(*[_type == $type && slug.${language}.current == $slug && !(_id in [$id, $draft])]) == 0`,
      {draft: `drafts.${id}`, id, slug: value, type},
    )

    return isUnique || 'This slug is already in use for this language.'
  }
}

export const localeSlug = defineType({
  name: 'localeSlug',
  title: 'Localized slug',
  type: 'object',
  fields: [
    defineField({
      name: 'sv',
      title: 'Swedish',
      type: 'slug',
      options: {
        source: sourceLocalizedSlug('sv'),
        isUnique: isUniqueSlug('sv'),
      },
      validation: (rule) =>
        rule.required().custom((value) => (value?.current ? true : 'A Swedish slug is required.')),
    }),
    defineField({
      name: 'en',
      title: 'English',
      description: 'Adding an English slug makes this document available in English.',
      type: 'slug',
      options: {
        source: sourceLocalizedSlug('en'),
        isUnique: isUniqueSlug('en'),
      },
    }),
  ],
})
