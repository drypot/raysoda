import { loadConfigSync } from '../../_util/config-loader.js'
import { DB } from '../_db/db.js'
import { ValueDB } from '../value/value-db.js'
import { BannerDB } from './banner-db.js'
import { Config } from '../../_type/config.js'
import { Banner } from '../../_type/banner.js'
import { dupe } from '../../_util/object2.js'

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

  const list: Banner[] = [
    { text: 'text1', url: 'url1' }
  ]

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
    await bdb.setBannerList(list)
  })
  it('banner contains item', async () => {
    const b = bdb.getBannerList()
    expect(dupe(b)).toEqual(list)
  })
  it('reset bdb', async () => {
    bdb = await BannerDB.from(vdb).load()
  })
  it('banner contains item', async () => {
    const b = bdb.getBannerList()
    expect(dupe(b)).toEqual(list)
  })

})
