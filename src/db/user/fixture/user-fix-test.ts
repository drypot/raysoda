import { loadConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../_db/db.js'
import { UserDB } from '../user-db.js'
import { insertUserFix1, insertUserFix4 } from './user-fix.js'
import { Config } from '../../../_type/config.js'

describe('User Fixture', () => {

  let config: Config
  let db: DB
  let udb: UserDB

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('insertUserFix1', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('user1 not exists', async () => {
      let user = await udb.findUserById(1)
      expect(user?.id).toBe(undefined)
    })
    it('insert fixture 1', async () => {
      await insertUserFix1(udb)
    })
    it('user1 exists', async () => {
      let user = await udb.findUserById(1)
      expect(user?.id).toBe(1)
    })
  })

  describe('insertUserFix4', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill table with fixture 4', async () => {
      await insertUserFix4(udb)
    })
    it('user1 should exist', async () => {
      let user = await udb.findUserById(1)
      expect(user?.home).toBe('user1')
      expect(user?.admin).toBe(false)
    })
    it('user3 should exist', async () => {
      let user = await udb.findUserById(3)
      expect(user?.home).toBe('user3')
      expect(user?.admin).toBe(false)
    })
    it('admin should exist', async () => {
      let user = await udb.findUserById(4)
      expect(user?.home).toBe('admin')
      expect(user?.admin).toBe(true)
    })
  })

})
