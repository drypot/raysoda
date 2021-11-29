import supertest, { SuperAgentTest } from 'supertest'
import {
  ADMIN,
  ADMIN_LOGIN_FORM,
  USER1,
  USER1_LOGIN_FORM,
  USER2,
  USER2_LOGIN_FORM,
  userFixInsert4
} from '@server/db/user/fixture/user-fix'
import { EMAIL_NOT_FOUND, NOT_AUTHORIZED, PASSWORD_WRONG } from '@common/type/error-const'
import { Express2, toCallback } from '@server/express/express2'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { userGetSessionUser, useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { userAssertAdmin, userAssertLogin } from '@server/domain/user/_service/user-auth'
import { GUEST_ID_CARD } from '@common/type/user'
import { UserDB } from '@server/db/user/user-db'
import { renderJson } from '@server/express/response'

describe('UserAuthApi', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
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

  it('setup should be admin', () => {
    web.router.get('/api/should-be-admin', toCallback(async function (req, res) {
      const user = userGetSessionUser(res)
      userAssertLogin(user)
      userAssertAdmin(user)
      renderJson(res, {})
    }))
  })
  // login & login-info
  it('login-info guest', async () => {
    const res = await sat.get('/api/user-login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })
  it('login as user1', async () => {
    const res = await sat.post('/api/user-login').send(USER1_LOGIN_FORM).expect(200)
    expect(res.body).toEqual({ user: { id: 1, name: USER1.name, home: USER1.home, admin: false }})
  })
  it('login-info user1', async () => {
    const res = await sat.get('/api/user-login-info').expect(200)
    expect(res.body).toEqual({ user: { id: 1, name: USER1.name, home: USER1.home, admin: false }})
  })
  it('login as user2', async () => {
    const res = await sat.post('/api/user-login').send(USER2_LOGIN_FORM).expect(200)
    expect(res.body).toEqual({ user: { id: 2, name: USER2.name, home: USER2.home, admin: false }})
  })
  it('login-info user2', async () => {
    const res = await sat.get('/api/user-login-info').expect(200)
    expect(res.body).toEqual({ user: { id: 2, name: USER2.name, home: USER2.home, admin: false }})
  })

  // permission
  it('login as user1', async () => {
    const res = await sat.post('/api/user-login').send(USER1_LOGIN_FORM).expect(200)
    expect(res.body.user.id).toBe(1)
  })
  it('should-be-admin fails', async () => {
    const res = await sat.get('/api/should-be-admin').expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    const res = await sat.post('/api/user-login').send(ADMIN_LOGIN_FORM).expect(200)
    expect(res.body).toEqual({ user: { id: 4, name: ADMIN.name, home: ADMIN.home, admin: true }})
  })
  it('should-be-admin ok', async () => {
    const res = await sat.get('/api/should-be-admin').expect(200)
    expect(res.body).toEqual({})
  })

  // logout
  it('logout', async () => {
    await sat.post('/api/user-logout').expect(200)
  })
  it('login-info after logout, returns guest', async () => {
    const res = await sat.get('/api/user-login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })

  // error
  it('invalid email', async () => {
    const form = { email: 'userx@mail.test', password: '1234', remember: false }
    const res = await sat.post('/api/user-login').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_NOT_FOUND)
  })
  it('invalid password', async () => {
    const form = { email: USER1.email, password: 'xxxx', remember: false }
    const res = await sat.post('/api/user-login').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_WRONG)
  })

})

