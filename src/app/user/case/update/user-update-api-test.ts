import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../../lib/db/db.js'
import { MSG_USER_NOT_FOUND, UserDB } from '../../db/user-db.js'
import { insertUserFix4 } from '../../db/user-db-fixture.js'
import { Express2 } from '../../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { Router } from 'express'
import { registerUserLoginApi } from '../login/user-login-api.js'
import { loginForTest, User1Login } from '../login/user-login-api-fixture.js'
import { registerUserUpdateApi } from './user-update-api.js'
import { checkHash } from '../../../../lib/base/hash.js'
import {
  EMAIL_DUPE,
  EMAIL_EMPTY,
  HOME_DUPE,
  HOME_EMPTY,
  NAME_DUPE,
  NAME_EMPTY,
  PASSWORD_RANGE
} from '../register-form/user-form.js'

describe('User Update Api', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let web: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)

    web = await Express2.from(config).start()
    registerUserLoginApi(web, udb)
    registerUserUpdateApi(web, udb)
    router = web.router
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
        password: '', profile: 'profile x'
      }
      const res = await request.put('/api/user/' + 1).send(form)
      expect(res.body).toEqual({})
    })
    it('check db', async () => {
      const user = await udb.findUserById(1)
      if (!user) throw new Error(MSG_USER_NOT_FOUND)
      expect(user.name).toBe('User X')
      expect(user.home).toBe('userx')
      expect(user.email).toBe('userx@mail.test')
      expect(await checkHash('1234', user.hash)).toBe(true)
      expect(user.profile).toBe('profile x')
    })
    it('check cache', async () => {
      const user = await udb.getCachedById(1)
      if (!user) throw new Error(MSG_USER_NOT_FOUND)
      expect(user.name).toBe('User X')
      expect(user.home).toBe('userx')
      expect(user.email).toBe('userx@mail.test')
      expect(await checkHash('1234', user.hash)).toBe(true)
      expect(user.profile).toBe('profile x')
    })
    it('update user1 password', async () => {
      const form = {
        name: 'User X', home: 'userx', email: 'userx@mail.test',
        password: '5678', profile: 'profile x'
      }
      const res = await request.put('/api/user/' + 1).send(form)
      expect(res.body).toEqual({})
    })
    it('check db', async () => {
      const user = await udb.findUserById(1)
      if (!user) throw new Error(MSG_USER_NOT_FOUND)
      expect(await checkHash('1234', user.hash)).toBe(false)
      expect(await checkHash('5678', user.hash)).toBe(true)
    })
    it('check cache', async () => {
      const user = await udb.getCachedById(1)
      if (!user) throw new Error(MSG_USER_NOT_FOUND)
      expect(await checkHash('1234', user.hash)).toBe(false)
      expect(await checkHash('5678', user.hash)).toBe(true)
    })
  })

  describe('update user (format check)', () => {
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
    it('fails if name empty', async () => {
      const form = {
        name: '', home: '', email: '',
        password: '', profile: ''
      }
      const res = await request.put('/api/user/' + 1).send(form)
      expect(res.body.err.length).toBe(3)
      expect(res.body.err).toContain(NAME_EMPTY)
      expect(res.body.err).toContain(HOME_EMPTY)
      expect(res.body.err).toContain(EMAIL_EMPTY)
    })
    it('fails if name in use', async () => {
      const form = {
        name: 'User 2', home: 'user2', email: 'user2@mail.test',
        password: '', profile: ''
      }
      const res = await request.put('/api/user/' + 1).send(form)
      expect(res.body.err.length).toBe(3)
      expect(res.body.err).toContain(NAME_DUPE)
      expect(res.body.err).toContain(HOME_DUPE)
      expect(res.body.err).toContain(EMAIL_DUPE)
    })
    it('fails if password short', async () => {
      const form = {
        name: 'User X', home: 'userx', email: 'userx@mail.test', password: '111'
      }
      const res = await request.put('/api/user/' + 1).send(form)
      expect(res.body.err.length).toBe(1)
      expect(res.body.err).toContain(PASSWORD_RANGE)
    })
  })

})
