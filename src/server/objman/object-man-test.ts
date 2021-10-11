import { objManCloseAllObjects, objManGetObject, objManReset } from './object-man'
import { ObjManFix1 } from './fixture/object-man-fix1'

describe('ObjMan', () => {
  it('reset fails if config not exists', () => {
    expect(() => {
      objManReset('config/not-exist.json')
    }).toThrow()
  })
  it('reset', () => {
    const config = objManReset('config/config-test.json')
    expect(config.appName).toBe('Test')
    expect(config.appNamel).toBe('test')
  })
  it('get object ', async () => {
    objManReset('config/config-test.json')
    const obj1 = await objManGetObject('ObjManFix1') as ObjManFix1
    expect(obj1.message).toBe('created')
    const obj2 = await objManGetObject('ObjManFix1') as ObjManFix1
    expect(obj2).toBe(obj1)
    const obj3 = await objManGetObject('ObjManFix1', true) as ObjManFix1
    expect(obj3).toBe(obj1)
    objManReset('config/config-test.json')
    const obj4 = await objManGetObject('ObjManFix1') as ObjManFix1
    expect(obj4).not.toBe(obj1)
  })
  it('close handler', async () => {
    objManReset('config/config-test.json')
    const obj1 = await objManGetObject('ObjManFix1') as ObjManFix1
    expect(obj1.message).toBe('created')
    await objManCloseAllObjects()
    expect(obj1.message).toBe('destroyed')
  })
})
