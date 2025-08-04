import { OsokyFileManager } from './osoky-fileman.ts'
import { getImageFileManager } from './fileman-loader.ts'
import { DrypotFileManager } from './drypot-fileman.ts'
import { RaySodaFileManager } from './raysoda-fileman.ts'
import { RapixelFileManager } from './rapixel-fileman.ts'
import { initObjectContext } from '../oman/oman.ts'

describe('getImageFileManager', () => {
  beforeAll(() => {
    initObjectContext('config/raysoda-test.json')
  })
  it('raysoda', async () => {
    const ifm = await getImageFileManager('raysoda')
    expect(ifm instanceof RaySodaFileManager).toBe(true)
  })
  it('rapixel', async () => {
    const ifm = await getImageFileManager('rapixel')
    expect(ifm instanceof RapixelFileManager).toBe(true)
  })
  it('osoky', async () => {
    const ifm = await getImageFileManager('osoky')
    expect(ifm instanceof OsokyFileManager).toBe(true)
  })
  it('drypot', async () => {
    const ifm = await getImageFileManager('drypot')
    expect(ifm instanceof DrypotFileManager).toBe(true)
  })
})
