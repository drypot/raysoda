import { loadConfigSync } from '../../_util/config-loader.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { ADMIN, insertUserFix4, USER1, USER2 } from '../../db/user/fixture/user-fix.js'
import { userActivateService, userDeactivateService } from './user-deactivate-service.js'
import { NOT_AUTHORIZED, USER_NOT_FOUND } from '../../_type/error-user.js'
import { Config } from '../../_type/config.js'
import { UserCache } from '../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../_type/error.js'

describe('userDeactivateService', () => {

  let config: Config
  let db: DB
  let udb: UserDB
  let uc: UserCache

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)
  })

  afterAll(async () => {
    await db.close()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable(false)
  })
  it('fill fix', async () => {
    await insertUserFix4(udb)
  })
  it('user1 status should be "v"', async () => {
    const user = await uc.getCachedById(1)
    expect(user?.status).toBe('v')
  })
  it('deactivate user1', async () => {
    const err: ErrorConst[] = []
    await userDeactivateService(uc, USER1, 1, err)
    expect(err.length).toBe(0)
  })
  it('user1 status should be d', async () => {
    const user = await udb.findUserById(1)
    expect(user?.status).toBe('d')
  })
  it('user1 status should be d in cache', async () => {
    const user = await uc.getCachedById(1)
    expect(user?.status).toBe('d')
  })
  it('reactivate user1', async () => {
    const err: ErrorConst[] = []
    await userActivateService(uc, ADMIN, 1, err)
    expect(err.length).toBe(0)
  })
  it('user1 status should be v', async () => {
    const user = await udb.findUserById(1)
    expect(user?.status).toBe('v')
  })
  it('user1 status should be v in cache', async () => {
    const user = await uc.getCachedById(1)
    expect(user?.status).toBe('v')
  })
  it('deactivate user1 by user2', async () => {
    const err: ErrorConst[] = []
    await userDeactivateService(uc, USER2, 1, err)
    expect(err).toContain(NOT_AUTHORIZED)
  })
  it('deactivate user1 by admin', async () => {
    const err: ErrorConst[] = []
    await userDeactivateService(uc, ADMIN, 1, err)
    expect(err.length).toBe(0)
  })
  it('deactivating user fails if id invalid', async () => {
    const err: ErrorConst[] = []
    await userDeactivateService(uc, ADMIN, 999, err)
    expect(err).toContain(USER_NOT_FOUND)
  })

})
