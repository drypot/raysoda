import { readConfigSync } from '../../_util/config-loader.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { userDeactivateService } from './user-deactivate-service.js'
import { USER_NOT_FOUND } from '../../_type/error-user.js'
import { Config } from '../../_type/config.js'
import { UserCache } from '../../db/user/user-cache.js'
import { ErrorConst } from '../../_type/error.js'

describe('User Deactivate Service', () => {

  let config: Config
  let db: DB
  let udb: UserDB
  let uc: UserCache

  beforeAll(async () => {
    config = readConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('userDeactivateService', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('user status should be "v"', async () => {
      const user = await udb.findUserById(1)
      expect(user?.status).toBe('v')
    })
    it('deactivate user', async () => {
      const err: ErrorConst[] = []
      await userDeactivateService(uc, 1, err)
      expect(err.length).toBe(0)
    })
    it('user status should be "d"', async () => {
      const user = await udb.findUserById(1)
      expect(user?.status).toBe('d')
    })
    it('deactivating user fails if id invalid', async () => {
      const err: ErrorConst[] = []
      await userDeactivateService(uc, 999, err)
      expect(err).toContain(USER_NOT_FOUND)
    })
  })

})
