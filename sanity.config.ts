import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

// https://www.sanity.io/guides/singleton-document
// Actions available on singleton documents
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

// Document types treated as singletons
const singletonTypes = new Set(['config'])

export default defineConfig({
  name: 'default',
  title: 'Malmö Klätterklubb',

  projectId: 'dajcvves',
  dataset: 'production',

  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,

    // Remove singleton types from the global "New document" menu
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    // Strip out "duplicate" and "delete" for singleton documents
    actions: (input, context) =>
      singletonTypes.has(context.schemaType) ?
        input.filter(({action}) => action && singletonActions.has(action))
      : input,
  },
})
