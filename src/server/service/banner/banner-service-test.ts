import { ValueDB } from '../../db/value/value-db'
import { BannerDB } from '../../db/banner/banner-db'
import { bannerListService, bannerListUpdateService } from './banner-service'
import { Banner } from '../../_type/banner'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'

describe('BannerApi List', () => {

  let vdb: ValueDB
  let bdb: BannerDB

  beforeAll(async () => {
    omanNewSessionForTest()
    vdb = await omanGetObject('ValueDB') as ValueDB
    bdb = await omanGetObject('BannerDB') as BannerDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await vdb.dropTable()
    await vdb.createTable()
    await bdb.loadCache()
  })
  it('get banner list', async () => {
    const list = bannerListService(bdb)
    expect(list).toEqual([])
  })
  it('set banner list', async () => {
    const list: Banner[] = [
      { text: 'text1', url: 'url1' },
      { text: 'text2', url: 'url2' },
      { text: 'text3', url: 'url3' },
    ]
    await bannerListUpdateService(bdb, list)
  })
  it('get banner list', async () => {
    const list = bannerListService(bdb)
    expect(list).toEqual([
      { text: 'text1', url: 'url1' },
      { text: 'text2', url: 'url2' },
      { text: 'text3', url: 'url3' },
    ])
  })

})


