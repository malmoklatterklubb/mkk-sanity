import {defineArrayMember, defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

/**
 * Leaf-level nav item — can link internally or externally, but has no children.
 * Used as the array member type inside navItem.children to avoid infinite recursion.
 */
export const navItemChild = defineType({
  name: 'navItemChild',
  title: 'Nav Item',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal', value: 'internal'},
          {title: 'External', value: 'external'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal Link',
      description: 'Link to a document in this Sanity project.',
      type: 'reference',
      to: [{type: 'page'}, {type: 'post'}],
      hidden: ({parent}) => parent?.linkType !== 'internal',
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const parent = ctx.parent as {linkType?: string}
          if (parent?.linkType === 'internal' && !value) return 'Required'
          return true
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (rule) =>
        rule.uri({scheme: ['http', 'https']}).custom((value, ctx) => {
          const parent = ctx.parent as {linkType?: string}
          if (parent?.linkType === 'external' && !value) return 'Required'
          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      linkType: 'linkType',
      externalUrl: 'externalUrl',
      internalTitle: 'internalLink.title',
    },
    prepare({title, linkType, externalUrl, internalTitle}) {
      const subtitle =
        linkType === 'external' ? externalUrl
        : internalTitle ? `→ ${internalTitle}`
        : 'Internal link'
      return {title, subtitle}
    },
  },
})

/**
 * Top-level nav item — can link internally, externally, or act as a group
 * (no direct link) with nested child items.
 */
export const navItem = defineType({
  name: 'navItem',
  title: 'Nav Item',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal', value: 'internal'},
          {title: 'External', value: 'external'},
          {title: 'No link (group only)', value: 'none'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal Link',
      description: 'Link to a document in this Sanity project.',
      type: 'reference',
      to: [{type: 'page'}, {type: 'post'}],
      hidden: ({parent}) => parent?.linkType !== 'internal',
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const parent = ctx.parent as {linkType?: string}
          if (parent?.linkType === 'internal' && !value) return 'Required'
          return true
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (rule) =>
        rule.uri({scheme: ['http', 'https']}).custom((value, ctx) => {
          const parent = ctx.parent as {linkType?: string}
          if (parent?.linkType === 'external' && !value) return 'Required'
          return true
        }),
    }),
    defineField({
      name: 'children',
      title: 'Sub-items',
      description: 'Optional nested navigation items (one level deep).',
      type: 'array',
      of: [defineArrayMember({type: 'navItemChild'})],
    }),
  ],
  preview: {
    select: {
      title: 'label',
      linkType: 'linkType',
      externalUrl: 'externalUrl',
      internalTitle: 'internalLink.title',
      children: 'children',
    },
    prepare({title, linkType, externalUrl, internalTitle, children}) {
      const childCount = Array.isArray(children) ? children.length : 0
      const childSuffix =
        childCount > 0 ? ` (${childCount} sub-item${childCount === 1 ? '' : 's'})` : ''

      const subtitle =
        linkType === 'none' ? `Group${childSuffix}`
        : linkType === 'external' ? `${externalUrl ?? ''}${childSuffix}`
        : `${internalTitle ? `→ ${internalTitle}` : 'Internal link'}${childSuffix}`

      return {title, subtitle}
    },
  },
})
