import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { waterfall } from '../../../lib/base/async2.js'
import { UserDB } from './user-db.js'
import { newUser } from '../entity/user-entity.js'

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
      newUser({ id: 1, name: 'Alice Liddell', home: 'alice', email: 'alice@mail.com' }),
    ]
    await db.insertObjects('user', objs)
  })

  describe('checkNameUsable', () => {
    it('should ok when name is not in use', async () => {
      const usable = await udb.checkNameUsable(0, 'Jon Snow')
      expect(usable).toBe(true)
    })
    it('should fail when name is in use', async () => {
      const usable = await udb.checkNameUsable(0, 'Alice Liddell')
      expect(usable).toBe(false)
    })
    it('should ok when name is mine', async () => {
      const usable = await udb.checkNameUsable(1, 'Alice Liddell')
      expect(usable).toBe(true)
    })
  })

})
