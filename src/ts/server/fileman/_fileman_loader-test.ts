import { OsokyFileManager } from '@server/fileman/osoky-fileman'
import { omanGetImageFileManager } from '@server/fileman/_fileman-loader'
import { DrypotFileManager } from '@server/fileman/drypot-fileman'
import { RaySodaFileManager } from '@server/fileman/raysoda-fileman'
import { RapixelFileManager } from '@server/fileman/rapixel-fileman'
import { omanNewSession } from '@server/oman/oman'

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
