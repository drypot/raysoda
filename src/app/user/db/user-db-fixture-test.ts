import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from './user-db.js'
import { insertUserDBFixture1, insertUserDBFixture4 } from './user-db-fixture.js'

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
      if (!user) throw new Error('User is empty')
      expect(user.id).toBe(1)
      expect(user.name).toBe('User Name 1')
      expect(user.home).toBe('user1')
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
      if (!user) throw new Error('User is empty')
      expect(user.id).toBe(1)
      expect(user.name).toBe('User Name 1')
      expect(user.home).toBe('user1')
      expect(user.admin).toBe(false)
    })
    it('user3 should exist', async () => {
      let user = await udb.findUserById(3)
      if (!user) throw new Error('User is empty')
      expect(user.id).toBe(3)
      expect(user.name).toBe('User Name 3')
      expect(user.home).toBe('user3')
      expect(user.admin).toBe(false)
    })
    it('admin should exist', async () => {
      let user = await udb.findUserById(4)
      if (!user) throw new Error('User is empty')
      expect(user.id).toBe(4)
      expect(user.name).toBe('Admin Name')
      expect(user.home).toBe('admin')
      expect(user.admin).toBe(true)
    })
  })

})
