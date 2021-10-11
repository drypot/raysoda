import { loadConfigSync } from '../../../../_util/config-loader.js'
import { DB } from '../../../../db/_db/db.js'
import { UserDB } from '../../../../db/user/user-db.js'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix.js'
import { Express2 } from '../../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserAuthApi } from '../../user-auth/api/user-auth-api.js'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture.js'
import { registerUserUpdateApi } from './user-update-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../../_type/error-user.js'
import { Config } from '../../../../_type/config.js'
import { UserCache } from '../../../../db/user/cache/user-cache.js'

describe('UserUpdateApi Get', () => {

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
    registerUserUpdateApi(web, uc)
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
  it('get user1 without login', async () => {
    const res = await sat.get('/api/user-update-get/' + 1).expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })
  it('login as user1', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('get user1', async () => {
    const res = await sat.get('/api/user-update-get/' + 1).expect(200)
    expect(res.body).toEqual({
      user: { name: 'User 1', home: 'user1', email: 'user1@mail.test', password: '', profile: '' }
    })
  })
  it('get user2 by user1', async () => {
    const res = await sat.get('/api/user-update-get/' + 2).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('get user2 by admin', async () => {
    const res = await sat.get('/api/user-update-get/' + 2).expect(200)
    expect(res.body).toEqual({
      user: { name: 'User 2', home: 'user2', email: 'user2@mail.test', password: '', profile: '' }
    })
  })

})
