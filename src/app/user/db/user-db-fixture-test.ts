import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { MSG_USER_UNDEFINED, UserDB } from './user-db.js'
import { insertUserDBFixture1, insertUserDBFixture4, UserFix1, UserFix3, UserFix4Admin } from './user-db-fixture.js'

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

  describe('insertUserDBFixture1', () => {
    beforeAll(async () => {
      await udb.dropTable()
      await udb.createTable(false)
      await insertUserDBFixture1(udb)
    })
    it('user1 should exist', async () => {
      let user = await udb.findUserById(1)
      if (!user) throw new Error(MSG_USER_UNDEFINED)
      expect(user.name).toBe(UserFix1.name)
      expect(user.home).toBe(UserFix1.home)
    })
  })

  describe('insertUserDBFixture4', () => {
    beforeAll(async () => {
      await udb.dropTable()
      await udb.createTable(false)
      await insertUserDBFixture4(udb)
    })
    it('user1 should exist', async () => {
      let user = await udb.findUserById(1)
      if (!user) throw new Error(MSG_USER_UNDEFINED)
      expect(user.name).toBe(UserFix1.name)
      expect(user.home).toBe(UserFix1.home)
      expect(user.admin).toBe(false)
    })
    it('user3 should exist', async () => {
      let user = await udb.findUserById(3)
      if (!user) throw new Error(MSG_USER_UNDEFINED)
      expect(user.name).toBe(UserFix3.name)
      expect(user.home).toBe(UserFix3.home)
      expect(user.admin).toBe(false)
    })
    it('admin should exist', async () => {
      let user = await udb.findUserById(4)
      if (!user) throw new Error(MSG_USER_UNDEFINED)
      expect(user.name).toBe(UserFix4Admin.name)
      expect(user.home).toBe(UserFix4Admin.home)
      expect(user.admin).toBe(true)
    })
  })

})
