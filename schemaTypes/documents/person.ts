import {defineArrayMember, defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Short bio',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'hideEmail',
      title: 'Private email',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'roles',
      title: 'Roles',
      description: 'Assign roles. Committee membership is derived from assigned roles.',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'role'}]})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      image: 'image',
      role0: 'roles.0.title',
      role1: 'roles.1.title',
      role2: 'roles.2.title',
      role3: 'roles.3.title',
    },
    prepare({name, image, role0, role1, role2, role3}) {
      const roles = [role0, role1, role2].filter(Boolean)
      const subtitle = roles.length === 0 ? 'No roles' : roles.join(', ')

      return {
        title: name ?? 'Untitled person',
        media: image,
        subtitle: role3 ? `${subtitle} …` : subtitle,
      }
    },
  },
})
