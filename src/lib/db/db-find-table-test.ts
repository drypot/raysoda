import { Config, loadConfig } from '../../app/config/config.js'
import { DB } from './db.js'

describe('DB', () => {

  let config: Config
  let db: DB

  beforeAll(async () => {
    config = loadConfig('config/app-test.json')
    db = new DB(config)
    await db.createDatabase()
  })

  afterAll(async () => {
    await db.close()
  })

  describe('findTable', () => {
    it('should work', async () => {
      await db.query('drop table if exists table1')
      await db.query('create table table1(id int)')
      const r = await db.findTable('table1')
      expect(r.length).toBe(1)
    })
    it('should work when table not exist', async () => {
      await db.query('drop table if exists table1')
      const r = await db.findTable('table1')
      expect(r.length).toBe(0)
    })
  })

})
