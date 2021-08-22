import { Config, configFrom } from '../config/config.js'
import { DB } from '../lib/db/db.js'
import { ValueDB } from '../lib/db/value-db.js'
import { BannerDB } from './banner-db.js'

describe('BannerDB', () => {

  let config: Config
  let db: DB
  let vdb: ValueDB
  let bdb: BannerDB

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
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
    bdb = BannerDB.from(vdb)
  })
  it('banner is empty', async () => {
    const b = await bdb.getBanner()
    expect(b.length).toBe(0)
  })
  it('set list and save', async () => {
    await bdb.setBanner([{ text: 'text1', url: 'url1' }])
  })
  it('banner contains item', async () => {
    const b = await bdb.getBanner()
    expect(b.length).toBe(1)
  })
  it('reset bdb', () => {
    bdb = BannerDB.from(vdb)
  })
  it('banner contains item', async () => {
    const b = await bdb.getBanner()
    expect(b.length).toBe(1)
  })

})
