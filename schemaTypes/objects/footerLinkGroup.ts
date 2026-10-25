import {defineArrayMember, defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'
import {getLocalizedValue} from '../lib/localization'

export const footerLinkGroup = defineType({
  name: 'footerLinkGroup',
  title: 'Footer link group',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) =>
        rule.custom((value) => Boolean(getLocalizedValue(value)) || 'A Swedish title is required.'),
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({type: 'navItemChild'})],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      links: 'links',
    },
    prepare({title, links}) {
      const linkCount = Array.isArray(links) ? links.length : 0

      return {
        title: getLocalizedValue(title) ?? 'Untitled footer group',
        subtitle: `${linkCount} link${linkCount === 1 ? '' : 's'}`,
      }
    },
  },
})
