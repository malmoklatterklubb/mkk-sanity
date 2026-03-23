import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'firstName',
      title: 'First name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'hideEmail',
      title: 'Private',
      type: 'boolean',
      description: 'Hide email from public view',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      image: 'image',
      role: 'role',
    },
    prepare({firstName, lastName, image, role}) {
      return {
        title: `${firstName} ${lastName}`,
        media: image,
        subtitle: role,
      }
    },
  },
})
