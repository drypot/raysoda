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

  describe('getNextUserId', () => {
    beforeEach(async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('should work', () => {
      expect(udb.getNextUserId()).toBe(1)
      expect(udb.getNextUserId()).toBe(2)
      expect(udb.getNextUserId()).toBe(3)

      udb.setNextUserId(10)
      expect(udb.getNextUserId()).toBe(10)
      expect(udb.getNextUserId()).toBe(11)
    })
  })


})
