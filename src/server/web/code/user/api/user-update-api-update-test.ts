import { loadConfigSync } from '../../../../_util/config-loader'
import { DB } from '../../../../db/_db/db'
import { UserDB } from '../../../../db/user/user-db'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserAuthApi } from '../../user-auth/api/user-auth-api'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture'
import { registerUserUpdateApi } from './user-update-api'
import { checkHash } from '../../../../_util/hash'
import {
  EMAIL_DUPE,
  EMAIL_RANGE,
  HOME_DUPE,
  HOME_RANGE,
  NAME_DUPE,
  NAME_RANGE,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  PASSWORD_RANGE
} from '../../../../_type/error-user'
import { Config } from '../../../../_type/config'
import { UserCache } from '../../../../db/user/cache/user-cache'

describe('UserUpdateApi Update', () => {

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
  it('update user1 without login', async () => {
    const form = {
      name: 'User 11'
    }
    const res = await sat.put('/api/user-update/' + 1).send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })
  it('login as user1', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('update user1', async () => {
    const form = {
      name: 'User 11', home: 'user11', email: 'user11@mail.test',
      password: '5678', profile: 'profile 11'
    }
    const res = await sat.put('/api/user-update/' + 1).send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('check db', async () => {
    const user = await udb.findUserById(1)
    if (!user) throw new Error()
    expect(user.name).toBe('User 11')
    expect(user.home).toBe('user11')
    expect(user.email).toBe('user11@mail.test')
    expect(await checkHash('5678', user.hash)).toBe(true)
    expect(user.profile).toBe('profile 11')
  })
  it('check cache', async () => {
    const user = await uc.getCachedById(1)
    if (!user) throw new Error()
    expect(user.name).toBe('User 11')
    expect(user.home).toBe('user11')
    expect(user.email).toBe('user11@mail.test')
    expect(await checkHash('5678', user.hash)).toBe(true)
    expect(user.profile).toBe('profile 11')
  })
  it('password can be omitted', async () => {
    const form = {
      name: 'User 11', home: 'user11', email: 'user11@mail.test',
      password: '', profile: 'profile 11'
    }
    const res = await sat.put('/api/user-update/' + 1).send(form).expect(200)
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
    const res = await sat.put('/api/user-update/' + 1).send(form).expect(200)
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
    const res = await sat.put('/api/user-update/' + 1).send(form).expect(200)
    expect(res.body.err).toContain(NAME_DUPE)
    expect(res.body.err).toContain(HOME_DUPE)
    expect(res.body.err).toContain(EMAIL_DUPE)
  })
  it('update user2 by user1', async () => {
    const form = {
      name: 'User 22'
    }
    const res = await sat.put('/api/user-update/' + 2).send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('update user2 by admin', async () => {
    const form = {
      name: 'User 22', home: 'user22', email: 'user22@mail.test',
      password: '', profile: 'profile 22'
    }
    const res = await sat.put('/api/user-update/' + 2).send(form).expect(200)
    expect(res.body).toEqual({})
  })

})
