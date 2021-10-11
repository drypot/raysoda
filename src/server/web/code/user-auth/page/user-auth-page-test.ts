import { loadConfigSync } from '../../../../_util/config-loader'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserAuthPage } from './user-auth-page'
import { Config } from '../../../../_type/config'
import { DB } from '../../../../db/_db/db'
import { UserDB } from '../../../../db/user/user-db'
import { UserCache } from '../../../../db/user/cache/user-cache'
import { registerUserAuthApi } from '../api/user-auth-api'
import { insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix'
import { NOT_AUTHENTICATED } from '../../../../_type/error-user'
import { loginForTest } from '../api/user-auth-api-fixture'

describe('UserAuthPage', () => {

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
    registerUserAuthPage(web)
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
