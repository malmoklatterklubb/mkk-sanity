import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
// import {svSELocale} from '@sanity/locale-sv-se'

export default defineConfig({
  name: 'default',
  title: 'Malmö Klätterklubb',

  projectId: 'dajcvves',
  dataset: 'production',

  plugins: [
    structureTool(),
    // svSELocale(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
