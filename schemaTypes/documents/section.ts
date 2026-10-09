import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const section = defineType({
  name: 'section',
  title: 'Committee',
  type: 'document',
  icon: UsersIcon,
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
      name: 'description',
      title: 'Description',
      type: 'portableText',
    }),
    defineField({
      name: 'recruitmentInfo',
      title: 'Recruitment information',
      type: 'portableText',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
    prepare({title, subtitle}) {
      return {title, subtitle: subtitle ? `/${subtitle}` : 'No slug'}
    },
  },
})
