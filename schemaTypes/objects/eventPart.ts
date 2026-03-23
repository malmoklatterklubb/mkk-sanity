import {defineField, defineType} from 'sanity'
import {ClockIcon} from '@sanity/icons'

export const eventPart = defineType({
  name: 'eventPart',
  title: 'Part',
  type: 'object',
  icon: ClockIcon,
  fields: [
    defineField({
      name: 'start',
      title: 'Start',
      type: 'datetime',
      options: {timeStep: 15},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'end',
      title: 'End',
      type: 'datetime',
      options: {timeStep: 15},
      validation: (rule) =>
        rule.required().custom((end, ctx) => {
          const parent = ctx.parent as {start?: string}
          if (parent?.start && end && new Date(end) <= new Date(parent.start)) {
            return 'End must be after start'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      start: 'start',
      end: 'end',
    },
    prepare({start, end}) {
      const fmt = (dt: string) =>
        new Date(dt).toLocaleString('sv-SE', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      return {
        title: start ? fmt(start) : 'No start time set',
        subtitle: end ? `Ends ${fmt(end)}` : undefined,
      }
    },
  },
})
