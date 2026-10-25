import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) =>
        rule.custom((value) =>
          (
            Array.isArray(value) &&
            value.some((item) => (item.language ?? item._key) === 'sv' && item.value)
          ) ?
            true
          : 'A Swedish title is required.',
        ),
      initialValue: [{_key: 'sv', language: 'sv', value: 'Malmö Klätterklubb'}],
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
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
    prepare() {
      return {title: 'Home Page'}
    },
  },
})
