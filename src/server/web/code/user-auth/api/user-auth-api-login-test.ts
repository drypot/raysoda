import { loadConfigSync } from '../../../../_util/config-loader'
import { DB } from '../../../../db/_db/db'
import { UserDB } from '../../../../db/user/user-db'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN, USER2_LOGIN } from '../../../../db/user/fixture/user-fix'
import { Express2, toCallback } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { getSessionUser, registerUserAuthApi } from './user-auth-api'
import { EMAIL_NOT_FOUND, NOT_AUTHORIZED, PASSWORD_WRONG } from '../../../../_type/error-user'
import { Config } from '../../../../_type/config'
import { UserCache } from '../../../../db/user/cache/user-cache'
import { GUEST_ID_CARD } from '../../../../_type/user'
import { renderJson } from '../../_common/render-json'
import { shouldBeAdmin, shouldBeUser } from '../../../../service/user-auth/user-auth-service'

describe('UserAuthApi', () => {

  let config: Config
  let db: DB
  let udb: UserDB
  let uc: UserCache
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    web = Express2.from(config)
    registerUserAuthApi(web, uc)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable(false)
  })
  it('fill fix', async () => {
    await insertUserFix4(udb)
  })

  it('setup should be admin', () => {
    web.router.get('/api/should-be-admin', toCallback(async function (req, res) {
      const user = getSessionUser(res)
      shouldBeUser(user)
      shouldBeAdmin(user)
      renderJson(res, {})
    }))
  })
  // login & login-info
  it('login-info guest', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })
  it('login as user1', async () => {
    const res = await sat.post('/api/login').send(USER1_LOGIN).expect(200)
    expect(res.body).toEqual({ user: { id: 1, name: 'User 1', home: 'user1', admin: false }})
  })
  it('login-info user1', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body).toEqual({ user: { id: 1, name: 'User 1', home: 'user1', admin: false }})
  })
  it('login as user2', async () => {
    const res = await sat.post('/api/login').send(USER2_LOGIN).expect(200)
    expect(res.body).toEqual({ user: { id: 2, name: 'User 2', home: 'user2', admin: false }})
  })
  it('login-info user2', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body).toEqual({ user: { id: 2, name: 'User 2', home: 'user2', admin: false }})
  })

  // permission
  it('login as user1', async () => {
    const res = await sat.post('/api/login').send(USER1_LOGIN).expect(200)
    expect(res.body.user.id).toBe(1)
  })
  it('should-be-admin fails', async () => {
    const res = await sat.get('/api/should-be-admin').expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    const res = await sat.post('/api/login').send(ADMIN_LOGIN).expect(200)
    expect(res.body).toEqual({ user: { id: 4, name: 'Admin', home: 'admin', admin: true }})
  })
  it('should-be-admin ok', async () => {
    const res = await sat.get('/api/should-be-admin').expect(200)
    expect(res.body).toEqual({})
  })

  // logout
  it('logout', async () => {
    await sat.post('/api/logout').expect(200)
  })
  it('login-info after logout, returns guest', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })

  // error
  it('invalid email', async () => {
    const form = { email: 'userx@mail.test', password: '1234', remember: false }
    const res = await sat.post('/api/login').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_NOT_FOUND)
  })
  it('invalid password', async () => {
    const form = { email: 'user1@mail.test', password: 'xxxx', remember: false }
    const res = await sat.post('/api/login').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_WRONG)
  })

})

