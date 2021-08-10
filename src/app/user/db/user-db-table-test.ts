import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from './user-db.js'

describe('UserDB', () => {

  let config: Config
  let db: DB
  let udb: UserDB

  beforeAll(async () => {
    config = loadConfig('config/app-test.json')
    db = new DB(config)
    udb = new UserDB(db)
    await db.createDatabase()
  })

  afterAll(async () => {
    await db.close()
  })

  describe('createTable', () => {
    it('should work', async () => {
      await udb.dropTable()
      await udb.createTable(true) // 인덱스까지 만들어 본다
      const r = await db.findTable('user')
      expect(r.length).toBe(1)
    })
  })

  describe('dropTable', () => {
    it('should work', async () => {
      await udb.createTable(false)
      await udb.dropTable()
      const r = await db.findTable('user')
      expect(r.length).toBe(0)
    })
  })

})
