import { OsokyFileManager } from '@server/file/osoky-fileman'
import { omanGetImageFileManager } from '@server/file/_fileman-loader'
import { DrypotFileManager } from '@server/file/drypot-fileman'
import { RaySodaFileManager } from '@server/file/raysoda-fileman'
import { RapixelFileManager } from '@server/file/rapixel-fileman'
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
