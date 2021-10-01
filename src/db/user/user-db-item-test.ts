import { readConfigSync } from '../../_util/config-loader.js'
import { DB } from '../_db/db.js'
import { UserDB } from './user-db.js'
import { userOf } from '../../_type/user.js'
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

  describe('user', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('user not exists', async () => {
      const user = await udb.findUserById(1)
      expect(user?.id).toBe(undefined)
    })
    it('insert user', async () => {
      const user = userOf({ id: 1, name: 'User 1', home: 'user1', email: 'user1@mail.test' })
      await udb.insertUser(user)
    })
    it('user exists', async () => {
      const user = await udb.findUserById(1)
      expect(user?.id).toBe(1)
    })
    it('user 999 not exists', async () => {
      const user = await udb.findUserById(999)
      expect(user?.id).toBe(undefined)
    })
    it('user user1@mail.test exists', async () => {
      const user = await udb.findUserByEmail('user1@mail.test')
      expect(user?.id).toBe(1)
    })
    it('user userX@mail.test not exists', async () => {
      const user = await udb.findUserByEmail('userx@mail.test')
      expect(user?.id).toBe(undefined)
    })
    it('user1 exists', async () => {
      const user = await udb.findUserByHome('user1')
      expect(user?.id).toBe(1)
    })
    it('userX not exists', async () => {
      const user = await udb.findUserByHome('userX')
      expect(user?.id).toBe(undefined)
    })
  })

})
