import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from './user-db.js'
import { userOf } from '../entity/user-entity.js'

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
    it('user 1 should exist', async () => {
      const user = await udb.findUserById(1)
      expect(user?.id).toBe(1)
    })
    it('user 999 should not exist', async () => {
      const user = await udb.findUserById(999)
      expect(user?.id).toBe(undefined)
    })
  })

  describe('findUserByEmail', () => {
    it('user user1@mail.test should exist', async () => {
      const user = await udb.findUserByEmail('user1@mail.test')
      expect(user?.id).toBe(1)
    })
    it('user userX@mail.test should not exist', async () => {
      const user = await udb.findUserByEmail('userx@mail.test')
      expect(user?.id).toBe(undefined)
    })
  })

  describe('findUserByHome', () => {
    it('user1 should exist', async () => {
      const user = await udb.findUserByHome('user1')
      expect(user?.id).toBe(1)
    })
    it('userX should not exist', async () => {
      const user = await udb.findUserByHome('userX')
      expect(user?.id).toBe(undefined)
    })
  })

})
