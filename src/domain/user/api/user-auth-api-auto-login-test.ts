import supertest from 'supertest'
import { DB, getDatabase } from '../../../db/db/db.ts'
import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.ts'
import { useUserAuthApi } from './user-auth-api.ts'
import { insertUserFix4, USER1, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.ts'
import { renderJson } from '../../../express/response.ts'
import { GUEST_ID_CARD } from '../../../common/type/user.ts'
import { userLoginForTest, userLogoutForTest } from './user-auth-api-fixture.ts'

describe('UserAuthApi Auto Login', () => {

  let db: DB
  let udb: UserDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getDatabase()
    udb = await getUserDB()
    express2 = await getExpress2()
    await useUserAuthApi()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await insertUserFix4(udb)
  })

  it('setup', () => {
    express2.router.get('/api/cookies', function (req, res, done) {
      renderJson(res, req.cookies)
    })
    express2.router.post('/api/session-destroy', function (req, res, done) {
      req.session.destroy(() => {
        renderJson(res, {})
      })
    })
  })
  it('get login fails before login', async () => {
    const res = await agent.get('/api/user-login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })
  it('cookie should be empty', async () => {
    const res = await agent.get('/api/cookies').expect(200)
    expect(res.body.email).toBe(undefined)
  })

  it('login with remember', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM, true)
  })
  it('get login', async () => {
    const res = await agent.get('/api/user-login-info').expect(200)
    expect(res.body.user.id).toBe(1)
  })
  it('cookies are filled', async () => {
    const res = await agent.get('/api/cookies').expect(200)
    expect(res.body.email).toBe(USER1.email)
  })

  it('destroy session', async () => {
    await agent.post('/api/session-destroy').expect(200)
  })
  it('autologin works after destroy session', async () => {
    const res = await agent.get('/api/user-login-info').expect(200)
    expect(res.body.user.id).toBe(1)
  })
  it('cookies still exist', async () => {
    const res = await agent.get('/api/cookies').expect(200)
    expect(res.body.email).toBe(USER1.email)
  })

  it('logout', async () => {
    await userLogoutForTest(agent)
  })
  it('autologin not works after logout', async () => {
    const res = await agent.get('/api/user-login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })
  it('cookies are empty', async () => {
    const res = await agent.get('/api/cookies').expect(200)
    expect(res.body.email).toBe(undefined)
  })

  it('login before db email change', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM, true)
  })
  it('get login before db email change', async () => {
    const res = await agent.get('/api/user-login-info').expect(200)
    expect(res.body.err).toBe(undefined)
  })

  it('change db email', async () => {
    await db.query('update user set email = "userx@mail.test" where id = ?', 1)
  })
  it('destroy session', async () => {
    await agent.post('/api/session-destroy').expect(200)
  })
  it('autologin fails after db email change', async () => {
    const res = await agent.get('/api/user-login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })
  it('cookies are empty', async () => {
    const res = await agent.get('/api/cookies').expect(200)
    expect(res.body.email).toBe(undefined)
  })

})
