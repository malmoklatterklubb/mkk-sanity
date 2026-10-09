import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {CogIcon, DocumentIcon, DocumentTextIcon, HomeIcon, TagIcon, UsersIcon} from '@sanity/icons'

function singleton(S: StructureBuilder, type: 'homePage' | 'siteSettings', title: string) {
  return S.listItem()
    .title(title)
    .icon(type === 'homePage' ? HomeIcon : CogIcon)
    .child(S.document().schemaType(type).documentId(type).title(title))
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Malmö Klätterklubb')
    .items([
      singleton(S, 'homePage', 'Home Page'),
      S.documentTypeListItem('page').title('Pages').icon(DocumentIcon),
      S.documentTypeListItem('post').title('News').icon(DocumentTextIcon),
      S.divider(),
      S.documentTypeListItem('person').title('People').icon(UsersIcon),
      S.documentTypeListItem('section').title('Committees').icon(UsersIcon),
      S.documentTypeListItem('role').title('Roles').icon(TagIcon),
      S.divider(),
      singleton(S, 'siteSettings', 'Site Settings'),
    ])
