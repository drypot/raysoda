import { ObjManFix1 } from '@server/oman/fixture/oman-fix1'
import { closeAllObjects, getConfig, getObject, initObjectContext } from '@server/oman/oman'

describe('Oman', () => {
  it('new session fails if config not exists', () => {
    expect(() => {
      initObjectContext('config/not-exist.json')
    }).toThrow()
  })
  it('new session', () => {
    initObjectContext('config/raysoda-test.json')
    const config = getConfig()
    expect(config.appName).toBeDefined()
  })
  it('get object ', async () => {
    initObjectContext('config/raysoda-test.json')
    const obj1 = await getObject('ObjManFix1') as ObjManFix1
    expect(obj1.message).toBe('created')
    const obj2 = await getObject('ObjManFix1') as ObjManFix1
    expect(obj2).toBe(obj1)
    initObjectContext('config/raysoda-test.json')
    const obj4 = await getObject('ObjManFix1') as ObjManFix1
    expect(obj4).not.toBe(obj1)
  })
  it('close handler', async () => {
    initObjectContext('config/raysoda-test.json')
    const obj1 = await getObject('ObjManFix1') as ObjManFix1
    expect(obj1.message).toBe('created')
    await closeAllObjects()
    expect(obj1.message).toBe('destroyed')
  })
})
