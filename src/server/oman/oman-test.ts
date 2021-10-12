import { omanCloseAllObjects, omanGetObject, omanNewSession, omanNewSessionForTest } from './oman'
import { ObjManFix1 } from './fixture/oman-fix1'

describe('Oman', () => {
  it('new session fails if config not exists', () => {
    expect(() => {
      omanNewSession('config/not-exist.json')
    }).toThrow()
  })
  it('new session', () => {
    const config = omanNewSessionForTest()
    expect(config.appName).toBeDefined()
  })
  it('get object ', async () => {
    omanNewSessionForTest()
    const obj1 = await omanGetObject('ObjManFix1') as ObjManFix1
    expect(obj1.message).toBe('created')
    const obj2 = await omanGetObject('ObjManFix1') as ObjManFix1
    expect(obj2).toBe(obj1)
    omanNewSessionForTest()
    const obj4 = await omanGetObject('ObjManFix1') as ObjManFix1
    expect(obj4).not.toBe(obj1)
  })
  it('close handler', async () => {
    omanNewSessionForTest()
    const obj1 = await omanGetObject('ObjManFix1') as ObjManFix1
    expect(obj1.message).toBe('created')
    await omanCloseAllObjects()
    expect(obj1.message).toBe('destroyed')
  })
})
