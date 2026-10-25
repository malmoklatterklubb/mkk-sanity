import {defineMigration, set} from 'sanity/migrate'

const documentTypes = ['homePage', 'page', 'person', 'post', 'role', 'section', 'siteSettings']

export default defineMigration({
  title: 'Migrate internationalized array values to language fields',
  documentTypes,
  migrate: {
    object(node) {
      const type = node._type
      const oldLanguage = node._key
      const isInternationalizedValue =
        typeof type === 'string' &&
        type.startsWith('internationalizedArray') &&
        type.endsWith('Value')
      const isLegacyLocalizedValue = 'value' in node

      if (
        typeof oldLanguage !== 'string' ||
        !['sv', 'en'].includes(oldLanguage) ||
        typeof node.language === 'string' ||
        (!isInternationalizedValue && !isLegacyLocalizedValue)
      ) {
        return undefined
      }

      return set({...node, _key: undefined, language: oldLanguage})
    },
  },
})
