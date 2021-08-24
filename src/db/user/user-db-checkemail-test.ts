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

  describe('emailIsAvailable', () => {
    it('true if email available', async () => {
      const usable = await udb.emailIsAvailable(0, 'userx@mail.test')
      expect(usable).toBe(true)
    })
    it('true if same entity', async () => {
      const usable = await udb.emailIsAvailable(1, 'user1@mail.test')
      expect(usable).toBe(true)
    })
    it('false if email in use', async () => {
      const usable = await udb.emailIsAvailable(0, 'user1@mail.test')
      expect(usable).toBe(false)
    })
  })

})