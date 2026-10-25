import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      type: 'internationalizedArrayString',
      validation: (rule) =>
        rule.custom((value) =>
          (
            Array.isArray(value) &&
            value.some((item) => (item.language ?? item._key) === 'sv' && item.value)
          ) ?
            true
          : 'A Swedish site title is required.',
        ),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site description',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact information',
      type: 'object',
      fields: [
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (rule) => rule.email(),
        }),
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'text',
          rows: 3,
        }),
      ],
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'array',
      of: [defineArrayMember({type: 'navItem'})],
    }),
    defineField({
      name: 'footerLinkGroups',
      title: 'Footer link groups',
      description: 'Organize page links into groups for the site footer.',
      type: 'array',
      of: [defineArrayMember({type: 'footerLinkGroup'})],
    }),
  ],
  preview: {
    select: {title: 'siteTitle'},
    prepare({title}) {
      const localizedTitle =
        Array.isArray(title) ?
          title.find((item) => (item.language ?? item._key) === 'sv')?.value
        : title
      return {title: localizedTitle ?? 'Site Settings'}
    },
  },
})
