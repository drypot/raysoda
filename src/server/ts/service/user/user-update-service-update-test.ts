import {
  EMAIL_DUPE,
  EMAIL_RANGE,
  HOME_DUPE,
  HOME_RANGE,
  NAME_DUPE,
  NAME_RANGE,
  NOT_AUTHORIZED,
  PASSWORD_RANGE
} from '@common/type/error-const'
import { newUserUpdateForm } from '@common/type/user-form'
import { checkHash } from '@common/util/hash'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { ErrorConst } from '@common/type/error'
import { ADMIN, insertUserFix4, USER1, USER2 } from '@server/db/user/fixture/user-fix'
import { userUpdateService } from '@server/service/user/user-update-service'
import { UserDB } from '@server/db/user/user-db'

describe('userUpdateService', () => {

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
  it('update user1', async () => {
    const form = newUserUpdateForm({
      name: 'User X', home: 'userx', email: 'userx@mail.test',
      password: '', profile: 'profile x'
    })
    const err: ErrorConst[] = []
    await userUpdateService(udb, USER1, 1, form, err)
    expect(err.length).toBe(0)
  })
  it('check db', async () => {
    const user = await udb.findUserById(1)
    if (!user) throw new Error()
    expect(user.name).toBe('User X')
    expect(user.home).toBe('userx')
    expect(user.email).toBe('userx@mail.test')
    expect(await checkHash('1234', user.hash)).toBe(true)
    expect(user.profile).toBe('profile x')
  })
  it('check cache', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    expect(user.name).toBe('User X')
    expect(user.home).toBe('userx')
    expect(user.email).toBe('userx@mail.test')
    expect(await checkHash('1234', user.hash)).toBe(true)
    expect(user.profile).toBe('profile x')
  })
  it('update user1 password', async () => {
    const form = newUserUpdateForm({
      name: 'User X', home: 'userx', email: 'userx@mail.test',
      password: '5678', profile: 'profile x'
    })
    const err: ErrorConst[] = []
    await userUpdateService(udb, USER1, 1, form, err)
    expect(err.length).toBe(0)
  })
  it('check db', async () => {
    const user = await udb.findUserById(1)
    if (!user) throw new Error()
    expect(await checkHash('1234', user.hash)).toBe(false)
    expect(await checkHash('5678', user.hash)).toBe(true)
  })
  it('check cache', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    expect(await checkHash('1234', user.hash)).toBe(false)
    expect(await checkHash('5678', user.hash)).toBe(true)
  })
  it('format check works', async () => {
    const s33 = 'x'.repeat(33)
    const s65 = 'x'.repeat(66)
    const form = newUserUpdateForm({
      name: s33, home: s33, email: s65, password: s33, profile: ''
    })
    const err: ErrorConst[] = []
    await userUpdateService(udb, USER1, 1, form, err)
    expect(err).toContain(NAME_RANGE)
    expect(err).toContain(HOME_RANGE)
    expect(err).toContain(EMAIL_RANGE)
    expect(err).toContain(PASSWORD_RANGE)
  })
  it('dupe check works', async () => {
    const form = newUserUpdateForm({
      name: 'User 2', home: 'user2', email: 'user2@mail.test',
      password: '', profile: ''
    })
    const err: ErrorConst[] = []
    await userUpdateService(udb, USER1, 1, form, err)
    expect(err).toContain(NAME_DUPE)
    expect(err).toContain(HOME_DUPE)
    expect(err).toContain(EMAIL_DUPE)
  })
  it('update user1 by user2', async () => {
    const form = newUserUpdateForm({
      name: 'User X', home: 'userx', email: 'userx@mail.test',
      password: '', profile: 'profile x'
    })
    const err: ErrorConst[] = []
    await userUpdateService(udb, USER2, 1, form, err)
    expect(err).toContain(NOT_AUTHORIZED)
  })
  it('update user1 by admin', async () => {
    const form = newUserUpdateForm({
      name: 'User X', home: 'userx', email: 'userx@mail.test',
      password: '', profile: 'profile x'
    })
    const err: ErrorConst[] = []
    await userUpdateService(udb, ADMIN, 1, form, err)
    expect(err.length).toBe(0)
  })

})
