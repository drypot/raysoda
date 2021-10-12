import { UserDB } from '../../db/user/user-db'
import { ADMIN, insertUserFix4, USER1, USER2 } from '../../db/user/fixture/user-fix'
import { userUpdateGetService } from './user-update-service'
import { UserCache } from '../../db/user/cache/user-cache'
import { ErrorConst } from '../../_type/error'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'
import { NOT_AUTHORIZED } from '../../_type/error-const'

describe('userUpdateGetService', () => {

  let udb: UserDB
  let uc: UserCache

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    uc = await omanGetObject('UserCache') as UserCache
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
  it('get user1 for update', async () => {
    const err: ErrorConst[] = []
    const user1 = await userUpdateGetService(uc, USER1, 1, err)
    expect(user1).toEqual({
      name: 'User 1',
      home: 'user1',
      email: 'user1@mail.test',
      password: '',
      profile: '',
    })
    expect(err.length).toBe(0)
  })
  it('get user1 for update by user2', async () => {
    const err: ErrorConst[] = []
    const user1 = await userUpdateGetService(uc, USER2, 1, err)
    expect(user1).toBeUndefined()
    expect(err).toContain(NOT_AUTHORIZED)
  })
  it('get user1 for update by admin', async () => {
    const err: ErrorConst[] = []
    const user1 = await userUpdateGetService(uc, ADMIN, 1, err)
    expect(user1).toEqual({
      name: 'User 1',
      home: 'user1',
      email: 'user1@mail.test',
      password: '',
      profile: '',
    })
    expect(err.length).toBe(0)
  })

})
