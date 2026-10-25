import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'
import {getLocalizedValue, hasLocalizedValue, validateLocalizedImageAlt} from '../lib/localization'
import {validatePageParent} from '../lib/pageHierarchy'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
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
      name: 'parent',
      title: 'Parent page',
      description: 'Nest this page under another page. Leave empty for a top-level page.',
      type: 'reference',
      to: [{type: 'page'}],
      options: {
        filter: ({document}) => {
          const id = document?._id?.replace(/^drafts\./, '')

          return {
            filter:
              id ? '!(_id in path("drafts.**")) && _id != $id' : '!(_id in path("drafts.**"))',
            params: id ? {id} : {},
          }
        },
      },
      validation: (rule) => rule.custom((value, context) => validatePageParent(value, context)),
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured image',
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
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'person'}],
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
      slug: 'slug.sv.current',
      parentTitle: 'parent.title',
    },
    prepare({title, slug, parentTitle}) {
      const pageTitle = getLocalizedValue(title) ?? 'Untitled page'
      const parent = getLocalizedValue(parentTitle)

      console.log(JSON.stringify(parentTitle, null, 2))

      return {
        title: parent ? `${parent} / ${pageTitle}` : pageTitle,
        subtitle: slug ? `/${slug}` : 'No slug',
      }
    },
  },
})
