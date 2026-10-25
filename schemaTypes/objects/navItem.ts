import {defineArrayMember, defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'
import {getLocalizedValue} from '../lib/localization'

/** A child navigation item that links to a page. */
export const navItemChild = defineType({
  name: 'navItemChild',
  title: 'Navigation page',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      description: 'Select the page to link to.',
      type: 'reference',
      to: [{type: 'page'}],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'page.title',
      slug: 'page.slug.sv.current',
    },
    prepare({title, slug}) {
      return {
        title: getLocalizedValue(title) ?? 'Untitled page',
        subtitle: slug ? `/${slug}` : 'No slug',
      }
    },
  },
})

/** A top-level navigation page with optional nested child pages. */
export const navItem = defineType({
  name: 'navItem',
  title: 'Navigation page',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      description: 'Select the page to link to.',
      type: 'reference',
      to: [{type: 'page'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'children',
      title: 'Sub-pages',
      description: 'Optional nested pages shown under this navigation page.',
      type: 'array',
      of: [defineArrayMember({type: 'navItemChild'})],
    }),
  ],
  preview: {
    select: {
      title: 'page.title',
      slug: 'page.slug.sv.current',
      children: 'children',
    },
    prepare({title, slug, children}) {
      const childCount = Array.isArray(children) ? children.length : 0
      const subtitle = slug ? `/${slug}` : 'No slug'

      return {
        title: getLocalizedValue(title) ?? 'Untitled page',
        subtitle: childCount > 0 ? `${subtitle} · ${childCount} sub-pages` : subtitle,
      }
    },
  },
})
