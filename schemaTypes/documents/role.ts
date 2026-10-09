import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const role = defineType({
  name: 'role',
  title: 'Role',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'section',
      title: 'Committee',
      description: 'The committee this role belongs to.',
      type: 'reference',
      to: [{type: 'section'}],
    }),
    defineField({
      name: 'recruiting',
      title: 'Recruiting',
      description:
        'Enable when the club is looking for more people in this role, even when the role already has members.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      section: 'section.title',
      recruiting: 'recruiting',
    },
    prepare({title, section, recruiting}) {
      const subtitle = section ?? 'No committee'
      return {title, subtitle: recruiting ? `${subtitle} · Recruiting` : subtitle}
    },
  },
})
