import { Config, loadConfig } from '../../app/config/config.js'
import { DB } from './db.js'

describe('DB', () => {

  let config: Config
  let db: DB

  beforeAll(() => {
    config = loadConfig('config/app-test.json')
    db = new DB(config)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('create, drop, find Database', () => {
    it('should work', async () => {
      let r: any

      await db.dropDatabase()
      r = await db.findDatabase(config.mysqlDatabase)
      expect(r.length).toBe(0)

      await db.createDatabase()
      r = await db.findDatabase(config.mysqlDatabase)
      expect(r.length).toBe(1)

      await db.dropDatabase()
      r = await db.findDatabase(config.mysqlDatabase)
      expect(r.length).toBe(0)
    })
  })
})
