import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'
import {getLocalizedValue, hasLocalizedValue, validateLocalizedImageAlt} from '../lib/localization'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) =>
        rule.custom((value) => Boolean(hasLocalizedValue(value)) || 'A Swedish title is required.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'localeSlug',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'person'}],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
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
      name: 'excerpt',
      title: 'Excerpt',
      description: 'A short summary used in listings and previews.',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'internationalizedArrayPortableText',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      media: 'mainImage',
    },
    prepare({title, publishedAt, media}) {
      return {
        title: getLocalizedValue(title) ?? 'Untitled post',
        subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString('en-GB') : 'No date set',
        media,
      }
    },
  },
})
