import {defineArrayMember, defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

import {AutoTitleInput} from '../components/AutoTitleInput'
import {computeEventTitle, eventCategories} from '../lib/eventCategories'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {list: [...eventCategories]},
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      components: {input: AutoTitleInput},
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'parts',
      title: 'Parts',
      description: 'One entry per session, e.g. Monday 18:00–21:00 and Wednesday 18:00–21:00.',
      type: 'array',
      of: [defineArrayMember({type: 'eventPart'})],
      validation: (rule) => rule.required().min(1).error('At least one part is required.'),
    }),
    defineField({
      name: 'acceptsBookings',
      title: 'Accepts bookings',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'spots',
      title: 'Available spots',
      type: 'number',
      initialValue: 4,
      hidden: ({parent}) => !parent?.acceptsBookings,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const parent = ctx.parent as {acceptsBookings?: boolean}
          if (parent?.acceptsBookings && (value === undefined || value === null))
            return 'Required when bookings are enabled.'
          if (value !== undefined && value !== null && value < 1) return 'Must be at least 1.'
          return true
        }),
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking URL',
      description:
        'Link to the booking page, e.g. on Fienta. Leave blank and let the website create the booking page for you.',
      type: 'url',
      hidden: ({parent}) => !parent?.acceptsBookings,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      firstPartStart: 'parts.0.start',
      category: 'category',
    },
    prepare({title, firstPartStart, category}) {
      const categoryLabel = eventCategories.find((c) => c.value === category)?.title
      const autoTitle = computeEventTitle(category, firstPartStart)
      return {
        title: title ?? autoTitle ?? 'Untitled event',
        subtitle: [
          firstPartStart ? new Date(firstPartStart).toLocaleDateString('sv-SE') : null,
          categoryLabel ?? null,
        ]
          .filter(Boolean)
          .join(' · '),
        media: CalendarIcon,
      }
    },
  },
})
