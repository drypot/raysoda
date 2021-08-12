import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from './user-db.js'
import { insertUserDBFixture1 } from './user-db-fixture.js'

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
    await insertUserDBFixture1(udb)
  })

  describe('checkHomeUsable', () => {
    it('should ok when one entity', async () => {
      const usable = await udb.checkHomeUsable(1, 'user1')
      expect(usable).toBe(true)
    })
    it('should ok when valid', async () => {
      const usable = await udb.checkHomeUsable(0, 'alice')
      expect(usable).toBe(true)
    })
    it('should fail when in use', async () => {
      const usable = await udb.checkHomeUsable(0, 'user1')
      expect(usable).toBe(false)
    })
  })

})
