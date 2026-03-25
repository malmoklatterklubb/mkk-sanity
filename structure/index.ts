import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('event').title('Events'),
      S.documentTypeListItem('person').title('People'),
      S.divider(),
      S.listItem()
        .title('Settings')
        .id('config')
        .icon(CogIcon)
        .child(S.document().schemaType('config').documentId('config')),
    ])
