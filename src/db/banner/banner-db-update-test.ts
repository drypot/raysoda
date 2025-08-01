import { BannerDB } from './banner-db.js'
import { closeAllObjects, getObject, initObjectContext } from '../../oman/oman.js'
import { dupe } from '../../common/util/object2.js'

describe('BannerDB', () => {

  let bdb: BannerDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    bdb = await getObject('BannerDB') as BannerDB
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await bdb.dropTable()
    await bdb.createTable()
  })
  it('init bdb cache', async () => {
    await bdb.loadCache()
  })
  it('banner is empty', async () => {
    const b = bdb.getCachedBannerList()
    expect(dupe(b)).toEqual([])
  })
  it('set banner', async () => {
    await bdb.updateBannerList([
      { text: 'text1', url: 'url1' }
    ])
  })
  it('check banner', async () => {
    const list = bdb.getCachedBannerList()
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
    const list = bdb.getCachedBannerList()
    expect(dupe(list)).toEqual([
      { text: 'text1', url: 'url1' },
      { text: 'text2', url: 'url2' }
    ])
  })

})
