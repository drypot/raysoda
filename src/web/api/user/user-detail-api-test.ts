import { loadConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '../../../db/user/fixture/user-fix.js'
import { Express2 } from '../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserDetailApi } from './user-detail-api.js'
import { registerLoginApi } from '../user-login/login-api.js'
import { loginForTest } from '../user-login/login-api-fixture.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'

describe('User Detail Api', () => {

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

    web = await Express2.from(config).start()
    registerLoginApi(web, uc)
    registerUserDetailApi(web, uc)
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
  it('get user without login works', async () => {
    const res = await sat.get('/api/user/1').expect(200)
    expect(res.body.user.id).toBe(1)
    expect(res.body.user.home).toBe('user1')
    expect(res.body.user.email).toBe('')
  })
  it('login as user', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('get self works, returns email', async () => {
    const res = await sat.get('/api/user/1').expect(200)
    expect(res.body.user.id).toBe(1)
    expect(res.body.user.home).toBe('user1')
    expect(res.body.user.email).toBe('user1@mail.test')
  })
  it('get other works', async () => {
    const res = await sat.get('/api/user/2').expect(200)
    expect(res.body.user.id).toBe(2)
    expect(res.body.user.home).toBe('user2')
    expect(res.body.user.email).toBe('')
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('get other works, returns email', async () => {
    const res = await sat.get('/api/user/2').expect(200)
    expect(res.body.user.id).toBe(2)
    expect(res.body.user.home).toBe('user2')
    expect(res.body.user.email).toBe('user2@mail.test')
  })

})
