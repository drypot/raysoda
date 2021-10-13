import { omanGetImageFileManager } from './_fileman-loader'
import { RaySodaFileManager } from './raysoda-fileman'
import { omanNewSession } from '../oman/oman'
import { RapixelFileManager } from './rapixel-fileman'
import { OsokyFileManager } from './osoky-fileman'
import { DrypotFileManager } from './drypot-fileman'

describe('getImageFileManager', () => {
  beforeAll(() => {
    omanNewSession('config/raysoda-test.json')
  })
  it('raysoda', async () => {
    const ifm = await omanGetImageFileManager('raysoda')
    expect(ifm instanceof RaySodaFileManager).toBe(true)
  })
  it('rapixel', async () => {
    const ifm = await omanGetImageFileManager('rapixel')
    expect(ifm instanceof RapixelFileManager).toBe(true)
  })
  it('osoky', async () => {
    const ifm = await omanGetImageFileManager('osoky')
    expect(ifm instanceof OsokyFileManager).toBe(true)
  })
  it('drypot', async () => {
    const ifm = await omanGetImageFileManager('drypot')
    expect(ifm instanceof DrypotFileManager).toBe(true)
  })
})
