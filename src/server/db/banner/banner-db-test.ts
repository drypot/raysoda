import { BannerDB } from './banner-db'
import { Banner } from '../../_type/banner'
import { dupe } from '../../_util/object2'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'

describe('BannerDB', () => {

  let bdb: BannerDB

  beforeAll(async () => {
    omanNewSessionForTest()
    bdb = await omanGetObject('BannerDB') as BannerDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  const list: Banner[] = [
    { text: 'text1', url: 'url1' }
  ]

  it('init table', async () => {
    await bdb.vdb.dropTable()
    await bdb.vdb.createTable()
  })
  it('init bdb cache', async () => {
    bdb = await bdb.loadCache()
  })
  it('banner is empty', async () => {
    const b = bdb.getCached()
    expect(b.length).toBe(0)
  })
  it('set banner', async () => {
    await bdb.updateBannerList(list)
  })
  it('banner contains item', async () => {
    const b = bdb.getCached()
    expect(dupe(b)).toEqual(list)
  })
  it('new bdb', async () => {
    bdb = await BannerDB.from(bdb.vdb).loadCache()
  })
  it('banner contains item', async () => {
    const b = bdb.getCached()
    expect(dupe(b)).toEqual(list)
  })

})
