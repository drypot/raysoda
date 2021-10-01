import { loadConfigSync } from '../../_util/config-loader.js'
import { DB } from '../_db/db.js'
import { ValueDB } from '../value/value-db.js'
import { BannerDB } from './banner-db.js'
import { Config } from '../../_type/config.js'
import { getBanner } from '../../_type/banner.js'

describe('BannerDB', () => {
  let config: Config
  let db: DB
  let vdb: ValueDB
  let bdb: BannerDB

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    vdb = ValueDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  it('init table', async () => {
    await vdb.dropTable()
    await vdb.createTable()
  })
  it('init bdb', async () => {
    bdb = await BannerDB.from(vdb).load()
  })
  it('banner is empty', async () => {
    const b = bdb.getBannerList()
    expect(b.length).toBe(0)
  })
  it('set banner', async () => {
    await bdb.setBannerList([getBanner('text1', 'url1')])
  })
  it('banner contains item', async () => {
    const b = bdb.getBannerList()
    expect(b).toEqual([getBanner('text1', 'url1')])
  })
  it('reset bdb', async () => {
    bdb = await BannerDB.from(vdb).load()
  })
  it('banner contains item', async () => {
    const b = bdb.getBannerList()
    expect(b).toEqual([getBanner('text1', 'url1')])
  })
})
