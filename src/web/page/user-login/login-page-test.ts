import { loadConfigSync } from '../../../_util/config-loader.js'
import { Express2 } from '../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerLoginPage } from './login-page.js'
import { Config } from '../../../_type/config.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { registerLoginApi } from '../../api/user-login/login-api.js'
import { insertUserFix4, USER1_LOGIN } from '../../../db/user/fixture/user-fix.js'
import { NOT_AUTHENTICATED } from '../../../_type/error-user.js'
import { loginForTest } from '../../api/user-login/login-api-fixture.js'

describe('LoginPage', () => {

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
    registerLoginApi(web, uc)
    registerLoginPage(web)
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

  it('login', async () => {
    await sat.get('/login').expect(200).expect(/<title>Login/)
  })

  it('login as user1', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('login-info 1', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.err).toBeUndefined()
  })
  it('logout', async () => {
    await sat.get('/logout').expect(302).expect('Location', '/')
  })
  it('login-info fails', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })

})
