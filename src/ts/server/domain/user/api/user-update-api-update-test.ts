import supertest, { SuperAgentTest } from 'supertest'
import { useUserUpdateApi } from '@server/domain/user/api/user-update-api'
import { ADMIN_LOGIN_FORM, USER1_LOGIN_FORM, userFixInsert4 } from '@server/db/user/fixture/user-fix'
import {
  EMAIL_DUPE,
  EMAIL_RANGE,
  HOME_DUPE,
  HOME_EMPTY,
  HOME_RANGE,
  NAME_DUPE,
  NAME_RANGE,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  PASSWORD_RANGE
} from '@common/type/error-const'
import { checkHash } from '@common/util/hash'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { userLoginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { UserDB } from '@server/db/user/user-db'
import { UserUpdateForm } from '@common/type/user-form'

describe('UserUpdateApi Update', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useUserUpdateApi()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await userFixInsert4(udb)
  })

  it('update user1 without login', async () => {
    const form = {
      id: 1,
      name: 'User 11'
    }
    const res = await sat.put('/api/user-update').send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })

  it('login as user1', async () => {
    await userLoginForTest(sat, USER1_LOGIN_FORM)
  })
  it('update user1', async () => {
    const form: UserUpdateForm = {
      id: 1, name: 'User 11', home: 'user11', email: 'user11@mail.test',
      password: '5678', profile: 'profile 11'
    }
    const res = await sat.put('/api/user-update').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('check db', async () => {
    const user = await udb.findUserById(1)
    if (!user) throw new Error()
    expect(user.name).toBe('User 11')
    expect(user.home).toBe('user11')
    expect(user.email).toBe('user11@mail.test')
    expect(await checkHash('5678', user.hash)).toBe(true)
    expect(user.profile).toBe('profile 11')
  })
  it('check cache', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    expect(user.name).toBe('User 11')
    expect(user.home).toBe('user11')
    expect(user.email).toBe('user11@mail.test')
    expect(await checkHash('5678', user.hash)).toBe(true)
    expect(user.profile).toBe('profile 11')
  })
  it('password can be omitted', async () => {
    const form: UserUpdateForm = {
      id: 1, name: 'User 11', home: 'user11', email: 'user11@mail.test',
      password: '', profile: 'profile 11'
    }
    const res = await sat.put('/api/user-update').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('check db', async () => {
    const user = await udb.findUserById(1)
    if (!user) throw new Error()
    expect(await checkHash('5678', user.hash)).toBe(true)
  })
  it('check cache', async () => {
    const user = await udb.getCachedById(1)
    if (!user) throw new Error()
    expect(await checkHash('5678', user.hash)).toBe(true)
  })

  it('dupe check works', async () => {
    const form: UserUpdateForm = {
      id: 1, name: 'User 2', home: 'user2', email: 'user2@mail.test',
      password: '', profile: ''
    }
    const res = await sat.put('/api/user-update').send(form).expect(200)
    expect(res.body.err).toContain(NAME_DUPE)
    expect(res.body.err).toContain(HOME_DUPE)
    expect(res.body.err).toContain(EMAIL_DUPE)
  })

  it('format check works', async () => {
    const s33 = 'x'.repeat(33)
    const s65 = 'x'.repeat(66)
    const form: UserUpdateForm = {
      id: 1, name: s33, home: s33, email: s65, password: s33, profile: ''
    }
    const res = await sat.put('/api/user-update').send(form).expect(200)
    expect(res.body.err).toContain(NAME_RANGE)
    expect(res.body.err).toContain(HOME_RANGE)
    expect(res.body.err).toContain(EMAIL_RANGE)
    expect(res.body.err).toContain(PASSWORD_RANGE)
  })

  // home 외 다른 포멧 체크는 register 에 있다.

  it('empty home fails', async () => {
    const form = { id: 1, home: '' }
    const res = await sat.put('/api/user-update').send(form).expect(200)
    expect(res.body.err).toContain(HOME_EMPTY)
  })
  it('length 32 home ok', async () => {
    const form = { id: 1, home: 'x'.repeat(32) }
    const res = await sat.put('/api/user-update').send(form).expect(200)
    expect(res.body.err).not.toContain(HOME_RANGE)
  })
  it('length 33 home fails', async () => {
    const form = { id: 1, home: 'x'.repeat(33) }
    const res = await sat.put('/api/user-update').send(form).expect(200)
    expect(res.body.err).toContain(HOME_RANGE)
  })

  it('update user2 by user1 fails', async () => {
    const form = { id: 2, name: 'User 22' }
    const res = await sat.put('/api/user-update').send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await userLoginForTest(sat, ADMIN_LOGIN_FORM)
  })
  it('update user2 by admin works', async () => {
    const form = {
      id: 2, name: 'User 22', home: 'user22', email: 'user22@mail.test',
      password: '', profile: 'profile 22'
    }
    const res = await sat.put('/api/user-update').send(form).expect(200)
    expect(res.body).toEqual({})
  })

})
