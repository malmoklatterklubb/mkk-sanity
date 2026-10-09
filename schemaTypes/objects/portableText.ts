import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const portableText = defineType({
  name: 'portableText',
  title: 'Portable Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Heading 4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
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
              }),
              defineField({
                name: 'internalLink',
                title: 'Internal Link',
                type: 'reference',
                to: [{type: 'page'}, {type: 'post'}, {type: 'section'}],
                hidden: ({parent}) => parent?.linkType !== 'internal',
              }),
              defineField({
                name: 'externalUrl',
                title: 'External URL',
                type: 'url',
                hidden: ({parent}) => parent?.linkType !== 'external',
                validation: (rule) => rule.uri({scheme: ['http', 'https']}),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required().warning('Add alternative text for this image.'),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
      ],
    }),
    defineArrayMember({
      name: 'sectionReference',
      title: 'Committee',
      type: 'object',
      icon: UsersIcon,
      fields: [
        defineField({
          name: 'section',
          title: 'Committee',
          type: 'reference',
          to: [{type: 'section'}],
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: {
          title: 'section.title',
        },
        prepare({title}) {
          return {title: title ?? 'Committee'}
        },
      },
    }),
  ],
})
