import { configFrom } from '../../_util/config-loader.js'
import { DB } from '../_db/db.js'
import { ValueDB } from '../value/value-db.js'
import { BannerDB } from './banner-db.js'
import { Config } from '../../_type/config.js'

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

  describe('banner', () => {
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
    it('set banner', async () => {
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

})
