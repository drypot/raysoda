import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from './user-db.js'
import { newUser, User } from '../entity/user-entity.js'

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

  describe('insertUser', () => {
    beforeEach(async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('should work', async () => {
      let user: User | undefined

      user = await udb.findUserById(1)
      expect(user?.id).toBe(undefined)

      const user2 = newUser({ id: 1, name: 'Alice Liddell', home: 'alice', email: 'alice@mail.test' })
      await udb.insertUser(user2)

      user = await udb.findUserById(1)
      expect(user?.id).toBe(1)
    })
  })

})
