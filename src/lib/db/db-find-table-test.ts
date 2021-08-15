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
    it('after create table', async () => {
      await db.query('drop table if exists table1')
      await db.query('create table table1(id int)')
    })
    it('result should have table', async () => {
      const r = await db.findTable('table1')
      expect(r.length).toBe(1)
    })
    it('after drop table', async () => {
      await db.query('drop table if exists table1')
    })
    it('result should be empty', async () => {
      const r = await db.findTable('table1')
      expect(r.length).toBe(0)
    })
  })

})
