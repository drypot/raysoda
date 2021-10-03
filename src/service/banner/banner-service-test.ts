import { ValueDB } from '../../db/value/value-db.js'
import { loadConfigSync } from '../../_util/config-loader.js'
import { Config } from '../../_type/config.js'
import { BannerDB } from '../../db/banner/banner-db.js'
import { DB } from '../../db/_db/db.js'
import { bannerListService, bannerListUpdateService } from './banner-service.js'
import { Banner } from '../../_type/banner.js'

describe('Banner Api List', () => {
  let config: Config

  let db: DB
  let vdb: ValueDB
  let bdb: BannerDB

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    vdb = ValueDB.from(db)
    bdb = await BannerDB.from(vdb).load()
  })

  afterAll(async () => {
    await db.close()
  })

  it('init table', async () => {
    await vdb.dropTable()
    await vdb.createTable()
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


