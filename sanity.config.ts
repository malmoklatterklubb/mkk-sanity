import {defineConfig, isKeySegment} from 'sanity'
import {languageFilter} from '@sanity/language-filter'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {netlifyTool} from 'sanity-plugin-netlify'
import {schemaTypes} from './schemaTypes'
import {localizedDocumentTypes, supportedLanguages} from './schemaTypes/lib/localization'
import {structure} from './structure'

// https://www.sanity.io/guides/singleton-document
// Actions available on singleton documents
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

// Document types treated as singletons
const singletonTypes = new Set(['homePage', 'siteSettings'])

export default defineConfig({
  name: 'default',
  title: 'Malmö Klätterklubb',

  projectId: 'dajcvves',
  dataset: 'production',

  plugins: [
    internationalizedArray({
      languages: supportedLanguages,
      defaultLanguages: ['sv'],
      fieldTypes: ['string', 'text', 'portableText'],
      buttonLocations: ['field'],
      buttonAddAll: false,
      languageDisplay: 'titleOnly',
    }),
    languageFilter({
      supportedLanguages,
      defaultLanguages: ['sv'],
      documentTypes: localizedDocumentTypes,
      filterField: (enclosingType, member, selectedLanguageIds) => {
        if (
          enclosingType.jsonType === 'object' &&
          enclosingType.name.startsWith('internationalizedArray') &&
          'kind' in member
        ) {
          const pathEnd = member.field.path.slice(-2)
          const language =
            pathEnd[1] === 'value' && isKeySegment(pathEnd[0]) ? pathEnd[0]._key : null

          return language ? selectedLanguageIds.includes(language) : false
        }

        // Slugs are a compound field and must keep both route controls visible.
        if (enclosingType.name === 'localeSlug') return true

        if (enclosingType.jsonType === 'object' && enclosingType.name.startsWith('locale')) {
          return selectedLanguageIds.includes(member.name)
        }

        return true
      },
    }),
    netlifyTool(),
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
