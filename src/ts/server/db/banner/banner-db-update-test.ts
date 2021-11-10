import { BannerDB } from '@server/db/banner/banner-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { dupe } from '@common/util/object2'

describe('BannerDB', () => {

  let bdb: BannerDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    bdb = await omanGetObject('BannerDB') as BannerDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await bdb.dropTable()
    await bdb.createTable()
  })
  it('init bdb cache', async () => {
    await bdb.loadCache()
  })
  it('banner is empty', async () => {
    const b = bdb.getBannerListCached()
    expect(dupe(b)).toEqual([])
  })
  it('set banner', async () => {
    await bdb.updateBannerList([
      { text: 'text1', url: 'url1' }
    ])
  })
  it('check banner', async () => {
    const list = bdb.getBannerListCached()
    expect(dupe(list)).toEqual([
      { text: 'text1', url: 'url1' }
    ])
  })
  it('set banner 2', async () => {
    await bdb.updateBannerList([
      { text: 'text1', url: 'url1' },
      { text: 'text2', url: 'url2' }
    ])
  })
  it('check banner 2', async () => {
    const list = bdb.getBannerListCached()
    expect(dupe(list)).toEqual([
      { text: 'text1', url: 'url1' },
      { text: 'text2', url: 'url2' }
    ])
  })

})