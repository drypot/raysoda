import { configFrom } from '../../_util/config-loader.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { userListService } from './user-list-service.js'
import { Config } from '../../_type/config.js'

describe('User List Service', () => {

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

  describe('userListService', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('get list default opt', async () => {
      const l = await userListService(udb)
      expect(l.length).toBe(4)
      // ordered by pdate desc
      expect(l[0].home).toBe('user2')
      expect(l[1].home).toBe('user3')
      expect(l[2].home).toBe('user1')
      expect(l[3].home).toBe('admin')
    })
    it('get p 1, ps 3', async () => {
      const l = await userListService(udb, 1, 3)
      expect(l.length).toBe(3)
      // ordered by pdate desc
      expect(l[0].home).toBe('user2')
      expect(l[1].home).toBe('user3')
      expect(l[2].home).toBe('user1')
    })
    it('get p 2, ps 3', async () => {
      const l = await userListService(udb, 2, 3)
      expect(l.length).toBe(1)
      // ordered by pdate desc
      expect(l[0].home).toBe('admin')
    })
    it('get p 3, ps 3', async () => {
      const l = await userListService(udb, 3, 3)
      expect(l.length).toBe(0)
    })
  })

})
