import {describe, expect, it} from 'vitest'
import {schemaTypes} from './index'

describe('schemaTypes', () => {
  const names = schemaTypes.map((type) => type.name)

  function fieldNames(typeName: string) {
    const type = schemaTypes.find(({name}) => name === typeName) as
      | {fields?: {name: string}[]}
      | undefined

    return type?.fields?.map(({name}) => name) ?? []
  }

  function fieldType(typeName: string, fieldName: string) {
    const type = schemaTypes.find(({name}) => name === typeName) as
      | {fields?: {name: string; type: string}[]}
      | undefined

    return type?.fields?.find(({name}) => name === fieldName)?.type
  }

  it('registers the planned content architecture', () => {
    expect(names).toEqual(
      expect.arrayContaining([
        'homePage',
        'page',
        'person',
        'post',
        'role',
        'section',
        'siteSettings',
        'localeSlug',
      ]),
    )
  })

  it('keeps organisation relationships on person roles only', () => {
    expect(names).not.toContain('activityArea')
    expect(names).not.toContain('activityAreaMember')
    expect(names).not.toContain('activityAreaRole')
    expect(fieldNames('section')).toEqual(['title', 'slug', 'description', 'recruitmentInfo'])
    expect(fieldNames('role')).toEqual([
      'title',
      'description',
      'section',
      'recruiting',
      'sortOrder',
    ])
    expect(fieldNames('person')).toContain('roles')
  })

  it('uses field-level localized values for visitor-facing content', () => {
    expect(fieldType('page', 'title')).toBe('internationalizedArrayString')
    expect(fieldType('page', 'slug')).toBe('localeSlug')
    expect(fieldType('page', 'content')).toBe('internationalizedArrayPortableText')
    expect(fieldType('person', 'bio')).toBe('internationalizedArrayText')
    expect(fieldType('section', 'description')).toBe('internationalizedArrayPortableText')
    expect(fieldType('role', 'title')).toBe('internationalizedArrayString')
  })

  it('limits site navigation to pages with optional nested pages', () => {
    expect(fieldNames('navItem')).toEqual(['page', 'children'])
    expect(fieldNames('navItemChild')).toEqual(['page'])
    expect(fieldType('navItem', 'page')).toBe('reference')
    expect(fieldType('navItemChild', 'page')).toBe('reference')
  })
})
