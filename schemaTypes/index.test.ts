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
})
