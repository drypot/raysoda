import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
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

  describe('nameIsAvailable', () => {
    it('ok if available', async () => {
      const usable = await udb.nameIsAvailable(0, 'User X')
      expect(usable).toBe(true)
    })
    it('ok if same entity', async () => {
      const usable = await udb.nameIsAvailable(1, 'User 1')
      expect(usable).toBe(true)
    })
    it('fail if in use', async () => {
      const usable = await udb.nameIsAvailable(0, 'User 1')
      expect(usable).toBe(false)
    })
  })

})
