import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from './user-db.js'
import { insertUserDBFixture } from './user-db-fixture.js'

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

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserDBFixture(udb)
  })

  describe('checkEmailUsable', () => {
    it('should ok when email is not in use', async () => {
      const usable = await udb.checkEmailUsable(0, 'snow@mail.test')
      expect(usable).toBe(true)
    })
    it('should fail when email is in use', async () => {
      const usable = await udb.checkEmailUsable(0, 'alice@mail.test')
      expect(usable).toBe(false)
    })
    it('should ok when email is mine', async () => {
      const usable = await udb.checkEmailUsable(1, 'alice@mail.test')
      expect(usable).toBe(true)
    })
  })

})
