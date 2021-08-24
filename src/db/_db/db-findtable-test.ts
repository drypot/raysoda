import { Config, configFrom } from '../../config/config.js'
import { DB } from './db.js'

describe('DB', () => {

  let config: Config
  let db: DB

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    db = await DB.from(config).createDatabase()
  })

  afterAll(async () => {
    await db.close()
  })

  describe('findTable', () => {
    it('create table', async () => {
      await db.query('drop table if exists table1')
      await db.query('create table table1(id int)')
    })
    it('selectByUuid table works', async () => {
      expect(await db.tableExists('table1')).toBe(true)
    })
    it('drop table', async () => {
      await db.query('drop table if exists table1')
    })
    it('selectByUuid table returns nothing', async () => {
      expect(await db.tableExists('table1')).toBe(false)
    })
  })

})
