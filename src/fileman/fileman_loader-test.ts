import { OsokyFileManager } from './osoky-fileman.js'
import { getImageFileManager } from './fileman-loader.js'
import { DrypotFileManager } from './drypot-fileman.js'
import { RaySodaFileManager } from './raysoda-fileman.js'
import { RapixelFileManager } from './rapixel-fileman.js'
import { initObjectContext } from '../oman/oman.js'

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
