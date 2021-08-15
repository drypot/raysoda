import { Config, configFrom } from '../../app/config/config.js'
import { DB } from './db.js'

describe('DB', () => {

  let config: Config
  let db: DB

  beforeAll(() => {
    config = configFrom('config/app-test.json')
    db = DB.from(config)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('database scenario', () => {
    it('dropDatabase should work', async () => {
      await db.dropDatabase()
      const r = await db.findDatabase(config.mysqlDatabase)
      expect(r.length).toBe(0)
    })
    it('createDatabase should work', async () => {
      await db.createDatabase()
      const r = await db.findDatabase(config.mysqlDatabase)
      expect(r.length).toBe(1)
    })
    it('dropDatabase should work again', async () => {
      await db.dropDatabase()
      const r = await db.findDatabase(config.mysqlDatabase)
      expect(r.length).toBe(0)
    })
  })
})
