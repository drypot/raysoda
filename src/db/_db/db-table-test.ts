import { Config, configFrom } from '../../_config/config.js'
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

  describe('table', () => {
    it('create table', async () => {
      await db.query('drop table if exists table1')
      await db.query('create table table1(id int)')
    })
    it('find table returns table', async () => {
      expect(await db.findTable('table1')).toBeDefined()
    })
    it('drop table', async () => {
      await db.query('drop table if exists table1')
    })
    it('find table returns nothing', async () => {
      expect(await db.findTable('table1')).toBeUndefined()
    })
  })

})
