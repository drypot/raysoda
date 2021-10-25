import { BannerDB } from '@server/db/banner/banner-db'
import { Banner } from '@common/type/banner'
import { bannerListService, bannerListUpdateService } from '@server/domain/banner/_service/banner-service'
import { ValueDB } from '@server/db/value/value-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('BannerApi List', () => {

  let vdb: ValueDB
  let bdb: BannerDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
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


