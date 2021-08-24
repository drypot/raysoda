import { Config, configFrom } from '../../config/config.js'
import { DB } from '../_db/db.js'
import { UserDB } from './user-db.js'
import { userOf } from '../../entity/user-entity.js'

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

    const objs = [
      userOf({ id: 1, name: 'User 1', home: 'user1', email: 'user1@mail.test' }),
    ]
    await db.insertObjects('user', objs)
  })

  describe('findUserById', () => {
    it('user 1 exists', async () => {
      const user = await udb.selectUserById(1)
      expect(user?.id).toBe(1)
    })
    it('user 999 not exists', async () => {
      const user = await udb.selectUserById(999)
      expect(user?.id).toBe(undefined)
    })
  })

  describe('selectUserByEmail', () => {
    it('user user1@mail.test exists', async () => {
      const user = await udb.selectUserByEmail('user1@mail.test')
      expect(user?.id).toBe(1)
    })
    it('user userX@mail.test not exists', async () => {
      const user = await udb.selectUserByEmail('userx@mail.test')
      expect(user?.id).toBe(undefined)
    })
  })

  describe('selectUserByHome', () => {
    it('user1 exists', async () => {
      const user = await udb.selectUserByHome('user1')
      expect(user?.id).toBe(1)
    })
    it('userX not exists', async () => {
      const user = await udb.selectUserByHome('userX')
      expect(user?.id).toBe(undefined)
    })
  })

})
