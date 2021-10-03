import { loadConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '../../../db/user/fixture/user-fix.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerLoginApi } from '../user-login/login-api.js'
import { loginForTest } from '../user-login/login-api-fixture.js'
import { registerUserUpdateApi } from './user-update-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../_type/error-user.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'

describe('UserUpdateApi', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    web = await Express2.from(config).start()
    registerLoginApi(web, uc)
    registerUserUpdateApi(web, uc)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  const form = { name: 'User X', home: 'userx', email: 'userx@mail.test', password: '1234', }

  describe('update without login', () => {
    it('update fails', async () => {
      const res = await request.put('/api/user-update/' + 1).send(form).expect(200)
      expect(res.body.err).toContain(NOT_AUTHENTICATED)
    })
  })

  describe('update self', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('login as user1', async () => {
      await loginForTest(request, USER1_LOGIN)
    })
    it('update user1 works', async () => {
      const res = await request.put('/api/user-update/' + 1).send(form).expect(200)
      expect(res.body).toEqual({})
    })
  })

  describe('update other', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('login as user1', async () => {
      await loginForTest(request, USER1_LOGIN)
    })
    it('update user2 fails', async () => {
      const res = await request.put('/api/user-update/' + 2).send(form).expect(200)
      expect(res.body.err).toContain(NOT_AUTHORIZED)
    })
  })

  describe('update as admin', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('login as admin', async () => {
      await loginForTest(request, ADMIN_LOGIN)
    })
    it('update user2 works', async () => {
      const res = await request.put('/api/user-update/' + 2).send(form).expect(200)
      expect(res.body).toEqual({})
    })
  })

})
