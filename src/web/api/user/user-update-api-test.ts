import { configFrom } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerLoginApi } from '../user-login/login-api.js'
import { loginForTest, User1Login } from '../user-login/login-api-fixture.js'
import { registerUserUpdateApi } from './user-update-api.js'
import { checkHash } from '../../../_util/hash.js'
import {
  EMAIL_DUPE,
  EMAIL_RANGE,
  HOME_DUPE,
  HOME_RANGE,
  NAME_DUPE,
  NAME_RANGE,
  PASSWORD_RANGE
} from '../../../_type/error-user.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'

describe('User Update Api', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

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

  describe('update user', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('login as user1', async () => {
      await loginForTest(request, User1Login)
    })
    it('update user1', async () => {
      const form = {
        name: 'User X', home: 'userx', email: 'userx@mail.test',
        password: '5678', profile: 'profile x'
      }
      const res = await request.put('/api/user-update/' + 1).send(form).expect(200)
      expect(res.body).toEqual({})
    })
    it('check db', async () => {
      const user = await udb.findUserById(1)
      if (!user) throw new Error()
      expect(user.name).toBe('User X')
      expect(user.home).toBe('userx')
      expect(user.email).toBe('userx@mail.test')
      expect(await checkHash('5678', user.hash)).toBe(true)
      expect(user.profile).toBe('profile x')
    })
    it('check cache', async () => {
      const user = await uc.getCachedById(1)
      if (!user) throw new Error()
      expect(user.name).toBe('User X')
      expect(user.home).toBe('userx')
      expect(user.email).toBe('userx@mail.test')
      expect(await checkHash('5678', user.hash)).toBe(true)
      expect(user.profile).toBe('profile x')
    })
    it('password can be omitted', async () => {
      const form = {
        name: 'User X', home: 'userx', email: 'userx@mail.test',
        password: '', profile: 'profile x'
      }
      const res = await request.put('/api/user-update/' + 1).send(form).expect(200)
      expect(res.body).toEqual({})
    })
    it('check db', async () => {
      const user = await udb.findUserById(1)
      if (!user) throw new Error()
      expect(await checkHash('5678', user.hash)).toBe(true)
    })
    it('check cache', async () => {
      const user = await uc.getCachedById(1)
      if (!user) throw new Error()
      expect(await checkHash('5678', user.hash)).toBe(true)
    })
    it('format check works', async () => {
      const s33 = 'x'.repeat(33)
      const s65 = 'x'.repeat(66)
      const form = {
        name: s33, home: s33, email: s65, password: s33, profile: ''
      }
      const res = await request.put('/api/user-update/' + 1).send(form).expect(200)
      expect(res.body.err).toContain(NAME_RANGE)
      expect(res.body.err).toContain(HOME_RANGE)
      expect(res.body.err).toContain(EMAIL_RANGE)
      expect(res.body.err).toContain(PASSWORD_RANGE)
    })
    it('dupe check works', async () => {
      const form = {
        name: 'User 2', home: 'user2', email: 'user2@mail.test',
        password: '', profile: ''
      }
      const res = await request.put('/api/user-update/' + 1).send(form).expect(200)
      expect(res.body.err).toContain(NAME_DUPE)
      expect(res.body.err).toContain(HOME_DUPE)
      expect(res.body.err).toContain(EMAIL_DUPE)
    })
  })

})