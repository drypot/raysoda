import { UserDB } from '../../db/user/user-db'
import { ADMIN, insertUserFix4, USER1, USER2 } from '../../db/user/fixture/user-fix'
import { userActivateService, userDeactivateService } from './user-deactivate-service'
import { ErrorConst } from '../../_type/error'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'
import { NOT_AUTHORIZED, USER_NOT_FOUND } from '../../_type/error-const'

describe('userDeactivateService', () => {

  let udb: UserDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await insertUserFix4(udb)
  })
  it('user1 status should be "v"', async () => {
    const user = await udb.getCachedById(1)
    expect(user?.status).toBe('v')
  })
  it('deactivate user1', async () => {
    const err: ErrorConst[] = []
    await userDeactivateService(udb, USER1, 1, err)
    expect(err.length).toBe(0)
  })
  it('user1 status should be d', async () => {
    const user = await udb.findUserById(1)
    expect(user?.status).toBe('d')
  })
  it('user1 status should be d in cache', async () => {
    const user = await udb.getCachedById(1)
    expect(user?.status).toBe('d')
  })
  it('reactivate user1', async () => {
    const err: ErrorConst[] = []
    await userActivateService(udb, ADMIN, 1, err)
    expect(err.length).toBe(0)
  })
  it('user1 status should be v', async () => {
    const user = await udb.findUserById(1)
    expect(user?.status).toBe('v')
  })
  it('user1 status should be v in cache', async () => {
    const user = await udb.getCachedById(1)
    expect(user?.status).toBe('v')
  })
  it('deactivate user1 by user2', async () => {
    const err: ErrorConst[] = []
    await userDeactivateService(udb, USER2, 1, err)
    expect(err).toContain(NOT_AUTHORIZED)
  })
  it('deactivate user1 by admin', async () => {
    const err: ErrorConst[] = []
    await userDeactivateService(udb, ADMIN, 1, err)
    expect(err.length).toBe(0)
  })
  it('deactivating user fails if id invalid', async () => {
    const err: ErrorConst[] = []
    await userDeactivateService(udb, ADMIN, 999, err)
    expect(err).toContain(USER_NOT_FOUND)
  })

})
