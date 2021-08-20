import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../lib/db/db.js'
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

  describe('insertUser', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('user not exists', async () => {
      const user = await udb.findUserById(123)
      expect(user?.id).toBe(undefined)
    })
    it('insert user', async () => {
      const user2 = userOf({ id: 123, name: 'User 1', home: 'user1', email: 'user1@mail.test' })
      await udb.insertUser(user2)
    })
    it('user exists', async () => {
      const user = await udb.findUserById(123)
      expect(user?.id).toBe(123)
    })
  })

})
