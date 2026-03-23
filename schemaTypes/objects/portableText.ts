import {defineArrayMember, defineField, defineType} from 'sanity'

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
                // Add document types here as you create them
                to: [{type: 'page'}, {type: 'post'}],
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
    }),
  ],
})
