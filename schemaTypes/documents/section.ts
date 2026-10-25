import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'
import {getLocalizedValue, hasLocalizedValue} from '../lib/localization'

export const section = defineType({
  name: 'section',
  title: 'Committee',
  type: 'document',
  icon: UsersIcon,
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
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayPortableText',
    }),
    defineField({
      name: 'recruitmentInfo',
      title: 'Recruitment information',
      type: 'internationalizedArrayPortableText',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.sv.current',
    },
    prepare({title, subtitle}) {
      return {
        title: getLocalizedValue(title) ?? 'Untitled committee',
        subtitle: subtitle ? `/${subtitle}` : 'No slug',
      }
    },
  },
})
