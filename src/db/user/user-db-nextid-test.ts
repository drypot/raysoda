import { readConfigSync } from '../../_util/config-loader.js'
import { DB } from '../_db/db.js'
import { UserDB } from './user-db.js'
import { Config } from '../../_type/config.js'

describe('UserDB', () => {

  let config: Config
  let db: DB
  let udb: UserDB

  beforeAll(async () => {
    config = readConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('nextUserId', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('get next user id', () => {
      expect(udb.getNextUserId()).toBe(1)
      expect(udb.getNextUserId()).toBe(2)
      expect(udb.getNextUserId()).toBe(3)
    })
    it('set next user id', () => {
      udb.setNextUserId(10)
    })
    it('get next user id', () => {
      expect(udb.getNextUserId()).toBe(10)
      expect(udb.getNextUserId()).toBe(11)
    })
  })

})
