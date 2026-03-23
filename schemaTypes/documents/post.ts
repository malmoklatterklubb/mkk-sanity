import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const post = defineType({
  name: 'post',
  title: 'Posts',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'A short summary used in listings and previews.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(200).warning('Keep under 200 characters for best results.'),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
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
        title,
        subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString('sv-SE') : 'No date set',
        media,
      }
    },
  },
})
