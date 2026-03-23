import {config} from './documents/config'
import {event} from './documents/event'
import {page} from './documents/page'
import {post} from './documents/post'
import {eventPart} from './objects/eventPart'
import {navItem, navItemChild} from './objects/navItem'
import {portableText} from './objects/portableText'

export const schemaTypes = [
  config,
  event,
  page,
  post,
  eventPart,
  portableText,
  navItem,
  navItemChild,
]
