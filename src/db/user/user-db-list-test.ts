import { Config, configFrom } from '../../config/config.js'
import { DB } from '../_db/db.js'
import { UserDB } from './user-db.js'
import { insertUserFix4 } from './user-db-fixture.js'

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

  describe('listUser', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('get list default opt', async () => {
      const l = await udb.listUser()
      expect(l.length).toBe(4)
      // ordered by pdate desc
      expect(l[0].home).toBe('user2')
      expect(l[1].home).toBe('user3')
      expect(l[2].home).toBe('user1')
      expect(l[3].home).toBe('admin')
    })
    it('get offset 0, ps 3', async () => {
      const l = await udb.listUser(0, 3)
      expect(l.length).toBe(3)
      // ordered by pdate desc
      expect(l[0].home).toBe('user2')
      expect(l[1].home).toBe('user3')
      expect(l[2].home).toBe('user1')
    })
    it('get offset 3, ps 3', async () => {
      const l = await udb.listUser(3, 3)
      expect(l.length).toBe(1)
      // ordered by pdate desc
      expect(l[0].home).toBe('admin')
    })
    it('get offset 6, ps 3', async () => {
      const l = await udb.listUser(6, 3)
      expect(l.length).toBe(0)
    })
  })

})
