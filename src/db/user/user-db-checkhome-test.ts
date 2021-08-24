import { Config, configFrom } from '../../config/config.js'
import { DB } from '../_db/db.js'
import { UserDB } from './user-db.js'
import { insertUserFix1 } from './user-db-fixture.js'

describe('UserDB', () => {

  let config: Config
  let db: DB
  let udb: UserDB

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserFix1(udb)
  })

  describe('homeIsDupe', () => {
    it('false if not dupe', async () => {
      const dupe = await udb.homeIsDupe(0, 'userx')
      expect(dupe).toBe(false)
    })
    it('false if same entity', async () => {
      const dupe = await udb.homeIsDupe(1, 'user1')
      expect(dupe).toBe(false)
    })
    it('true if dupe', async () => {
      const dupe = await udb.homeIsDupe(0, 'user1')
      expect(dupe).toBe(true)
    })
  })

})
