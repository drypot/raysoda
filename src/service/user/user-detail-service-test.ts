import { configFrom } from '../../_util/config-loader.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix1 } from '../../db/user/user-db-fixture.js'
import { userDetailService } from './user-detail-service.js'
import { Config } from '../../_type/config.js'

describe('User Detail Service', () => {

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

  describe('userViewService', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix1(udb)
    })
    it('return user info if id valid', async () => {
      const user = await userDetailService(udb, 1, false)
      if (!user) throw new Error()
      expect(user.id).toBe(1)
      expect(user.home).toBe('user1')
      expect(user.email).toBe(undefined)
      expect(user.adate).toBe(undefined)
    })
    it('return with email if privInfo true', async () => {
      const user = await userDetailService(udb, 1, true)
      if (!user) throw new Error()
      expect(user.id).toBe(1)
      expect(user.home).toBe('user1')
      expect(user.email).toBe('user1@mail.test')
      expect(user.adate).toBeDefined()
    })
    it('return undefined if id invalid', async () => {
      const user = await userDetailService(udb, 99, false)
      expect(user).toBe(undefined)
    })
  })

})
