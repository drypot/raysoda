import { loadConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '../../../db/user/fixture/user-fix.js'
import { Express2 } from '../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserGetApi } from './user-get-api.js'
import { registerLoginApi } from '../user-login/login-api.js'
import { loginForTest } from '../user-login/login-api-fixture.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { User } from '../../../_type/user.js'

describe('UserGetApi', () => {

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
    registerUserGetApi(web, uc)
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
  it('get user by guest', async () => {
    const res = await sat.get('/api/user/1').expect(200)
    expect(res.body).toEqual({
      user: {
        id: 1, name: 'User 1', home: 'user1', status: 'v', admin: false,
        cdate: 1042729200000, adate: 0, pdate: 1547046000000, profile: ''
      }
    })
  })
  it('login as user1', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('get user1 by user1', async () => {
    const res = await sat.get('/api/user/1').expect(200)
    const user1 = (await uc.getCachedById(1)) as User
    expect(res.body).toEqual({
      user: {
        id: 1, name: 'User 1', home: 'user1', status: 'v', admin: false,
        cdate: 1042729200000, adate: user1.adate.getTime(), pdate: 1547046000000, profile: ''
      }
    })
  })
  it('get user2 by user1', async () => {
    const res = await sat.get('/api/user/2').expect(200)
    expect(res.body).toEqual({
      user: {
        id: 2, name: 'User 2', home: 'user2', status: 'v', admin: false,
        cdate: 1044198000000, adate: 0, pdate: 1547910000000, profile: ''
      }
    })
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('get user2 by admin', async () => {
    const res = await sat.get('/api/user/2').expect(200)
    expect(res.body).toEqual({
      user: {
        id: 2, name: 'User 2', home: 'user2', status: 'v', admin: false,
        cdate: 1044198000000, adate: 1044198000000, pdate: 1547910000000, profile: ''
      }
    })
  })

})
