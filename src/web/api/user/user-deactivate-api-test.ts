import { loadConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN, USER2_LOGIN } from '../../../db/user/fixture/user-fix.js'
import { Express2 } from '../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserDeactivateApi } from './user-deactivate-api.js'
import { loginForTest } from '../user-login/login-api-fixture.js'
import { registerLoginApi } from '../user-login/login-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../_type/error-user.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'

describe('UserDeactivateApi', () => {

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
    registerUserDeactivateApi(web, uc)
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

  it('deactivating fails before login', async () => {
    const res = await sat.put('/api/user-deactivate/1').expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })

  it('login', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('get login', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.user.id).toBe(1)
  })
  it('deactivate user', async () => {
    const res = await sat.put('/api/user-deactivate/1').expect(200)
    expect(res.body).toEqual({})
  })
  it('get login fails', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })
  it('user status must be "d"', async () => {
    const user = await udb.findUserById(1)
    expect(user?.status).toBe('d')
  })

  it('login as user2', async () => {
    await loginForTest(sat, USER2_LOGIN)
  })
  it('deactivating other fails', async () => {
    const res = await sat.put('/api/user-deactivate/3').expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })

  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('deactivating other works', async () => {
    const res = await sat.put('/api/user-deactivate/3').expect(200)
    expect(res.body).toEqual({})
  })

})
