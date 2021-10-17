import { ObjManFix1 } from '@server/oman/fixture/oman-fix1'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('Oman', () => {
  it('new session fails if config not exists', () => {
    expect(() => {
      omanNewSession('config/not-exist.json')
    }).toThrow()
  })
  it('new session', () => {
    omanNewSession('config/raysoda-test.json')
    const config = omanGetConfig()
    expect(config.appName).toBeDefined()
  })
  it('get object ', async () => {
    omanNewSession('config/raysoda-test.json')
    const obj1 = await omanGetObject('ObjManFix1') as ObjManFix1
    expect(obj1.message).toBe('created')
    const obj2 = await omanGetObject('ObjManFix1') as ObjManFix1
    expect(obj2).toBe(obj1)
    omanNewSession('config/raysoda-test.json')
    const obj4 = await omanGetObject('ObjManFix1') as ObjManFix1
    expect(obj4).not.toBe(obj1)
  })
  it('close handler', async () => {
    omanNewSession('config/raysoda-test.json')
    const obj1 = await omanGetObject('ObjManFix1') as ObjManFix1
    expect(obj1.message).toBe('created')
    await omanCloseAllObjects()
    expect(obj1.message).toBe('destroyed')
  })
})
