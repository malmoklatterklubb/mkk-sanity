import {defineField, defineType} from 'sanity'
import {validateLocalizedImageAlt} from '../lib/localization'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'SEO title',
      description: 'Overrides the page title in search results when provided.',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'description',
      title: 'SEO description',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'image',
      title: 'Social sharing image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'internationalizedArrayString',
          validation: (rule) =>
            rule
              .custom((value, context) => validateLocalizedImageAlt(value, context.parent))
              .warning(),
        }),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
