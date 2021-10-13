import { BannerDB } from './banner-db'
import { Banner } from '../../_type/banner'
import { dupe } from '../../_util/object2'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'
import { ValueDB } from '../value/value-db'

describe('BannerDB', () => {

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

  const listFix: Banner[] = [
    { text: 'text1', url: 'url1' }
  ]

  it('init table', async () => {
    await vdb.dropTable()
    await vdb.createTable()
  })
  it('init bdb cache', async () => {
    await bdb.loadCache()
  })
  it('banner is empty', async () => {
    const b = bdb.getCached()
    expect(b.length).toBe(0)
  })
  it('set banner', async () => {
    await bdb.updateBannerList(listFix)
  })
  it('banner contains item', async () => {
    const list = bdb.getCached()
    expect(dupe(list)).toEqual(listFix)
  })
  it('new bdb', async () => {
    bdb = BannerDB.from(vdb)
    await bdb.loadCache()
  })
  it('banner contains item', async () => {
    const list = bdb.getCached()
    expect(dupe(list)).toEqual(listFix)
  })

})
