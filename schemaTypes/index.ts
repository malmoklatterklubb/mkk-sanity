import {homePage} from './documents/homePage'
import {page} from './documents/page'
import {post} from './documents/post'
import {navItem, navItemChild} from './objects/navItem'
import {localeSlug} from './objects/localeSlug'
import {portableText} from './objects/portableText'
import {person} from './documents/person'
import {role} from './documents/role'
import {section} from './documents/section'
import {siteSettings} from './documents/siteSettings'
import {seo} from './objects/seo'
import {footerLinkGroup} from './objects/footerLinkGroup'

export const schemaTypes = [
  homePage,
  page,
  post,
  portableText,
  navItem,
  navItemChild,
  footerLinkGroup,
  localeSlug,
  person,
  role,
  section,
  siteSettings,
  seo,
]
