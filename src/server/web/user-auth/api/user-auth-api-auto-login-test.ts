import { UserDB } from '../../../db/user/user-db'
import { insertUserFix4, USER1_LOGIN } from '../../../db/user/fixture/user-fix'
import { Express2 } from '../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserAuthApi } from './user-auth-api'
import { loginForTest, logoutForTest } from './user-auth-api-fixture'
import { GUEST_ID_CARD } from '../../../_type/user'
import { renderJson } from '../../_common/render-json'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../../oman/oman'
import { DB } from '../../../db/_db/db'

describe('UserAuthApi Auto Login', () => {

  let db: DB
  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    db = await omanGetObject('DB') as DB
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
    await insertUserFix4(udb)
  })

  it('setup', () => {
    web.router.get('/api/cookies', function (req, res, done) {
      renderJson(res, req.cookies)
    })
    web.router.post('/api/session-destroy', function (req, res, done) {
      req.session.destroy(() => {
        renderJson(res, {})
      })
    })
  })
  it('get login fails before login', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })
  it('cookie should be empty', async () => {
    const res = await sat.get('/api/cookies').expect(200)
    expect(res.body.email).toBe(undefined)
  })

  it('login with remember', async () => {
    await loginForTest(sat, USER1_LOGIN, true)
  })
  it('get login', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.user.id).toBe(1)
  })
  it('cookies are filled', async () => {
    const res = await sat.get('/api/cookies').expect(200)
    expect(res.body.email).toBe('user1@mail.test')
  })

  it('destroy session', async () => {
    await sat.post('/api/session-destroy').expect(200)
  })
  it('autologin works after destroy session', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.user.id).toBe(1)
  })
  it('cookies still exist', async () => {
    const res = await sat.get('/api/cookies').expect(200)
    expect(res.body.email).toBe('user1@mail.test')
  })

  it('logout', async () => {
    await logoutForTest(sat)
  })
  it('autologin not works after logout', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })
  it('cookies are empty', async () => {
    const res = await sat.get('/api/cookies').expect(200)
    expect(res.body.email).toBe(undefined)
  })

  it('login before db email change', async () => {
    await loginForTest(sat, USER1_LOGIN, true)
  })
  it('get login before db email change', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.err).toBe(undefined)
  })

  it('change db email', async () => {
    await db.query('update user set email = "userx@mail.test" where id = ?', 1)
  })
  it('destroy session', async () => {
    await sat.post('/api/session-destroy').expect(200)
  })
  it('autologin fails after db email change', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })
  it('cookies are empty', async () => {
    const res = await sat.get('/api/cookies').expect(200)
    expect(res.body.email).toBe(undefined)
  })

})
