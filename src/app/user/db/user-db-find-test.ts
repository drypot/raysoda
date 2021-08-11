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

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)

    const objs = [
      newUser({ id: 1, name: 'Alice Liddell', home: 'alice', email: 'alice@mail.test' }),
    ]
    await db.insertObjects('user', objs)
  })

  describe('findUserById', () => {
    it('should work', async () => {
      let user: User | undefined

      user = await udb.findUserById(1)
      expect(user?.id).toBe(1)

      user = await udb.findUserById(999)
      expect(user?.id).toBe(undefined)
    })
  })

  describe('findUserByEmail', () => {
    it('should work', async () => {
      let user: User | undefined

      user = await udb.findUserByEmail('alice@mail.test')
      expect(user?.id).toBe(1)

      user = await udb.findUserByEmail('xxx@mail.test')
      expect(user?.id).toBe(undefined)
    })
  })

  describe('findUserByHome', () => {
    it('should work', async () => {
      let user: User | undefined

      user = await udb.findUserByHome('alice')
      expect(user?.id).toBe(1)

      user = await udb.findUserByHome('jon')
      expect(user?.id).toBe(undefined)
    })
  })

})
