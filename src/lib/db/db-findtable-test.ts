import { Config, configFrom } from '../../app/config/config.js'
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
    it('find table works', async () => {
      const r = await db.findTable('table1')
      expect(r.length).toBe(1)
    })
    it('drop table', async () => {
      await db.query('drop table if exists table1')
    })
    it('find table returns nothing', async () => {
      const r = await db.findTable('table1')
      expect(r.length).toBe(0)
    })
  })

})
