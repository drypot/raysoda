import { loadConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerLoginApi } from './login-api.js'
import { EMAIL_NOT_FOUND, NOT_AUTHENTICATED, NOT_AUTHORIZED, PASSWORD_WRONG } from '../../../_type/error-user.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'

describe('Login Api', () => {
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
    request = web.spawnRequest()
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

  // login
  it('login as user1', async () => {
    const form = { email: 'user1@mail.test', password: '1234', remember: false }
    const res = await request.post('/api/login').send(form).expect(200)
    expect(res.body).toEqual({ user: { id: 1, name: 'User 1', home: 'user1', admin: false }})
  })
  it('login-info 1', async () => {
    const res = await request.get('/api/login-info').expect(200)
    expect(res.body).toEqual({ user: { id: 1, name: 'User 1', home: 'user1', admin: false }})
  })
  it('login as user2', async () => {
    const form = { email: 'user2@mail.test', password: '1234', remember: false }
    const res = await request.post('/api/login').send(form).expect(200)
    expect(res.body).toEqual({ user: { id: 2, name: 'User 2', home: 'user2', admin: false }})
  })
  it('login-info 2', async () => {
    const res = await request.get('/api/login-info').expect(200)
    expect(res.body).toEqual({ user: { id: 2, name: 'User 2', home: 'user2', admin: false }})
  })

  // permission
  it('login as user1', async () => {
    const form = { email: 'user1@mail.test', password: '1234', remember: false }
    const res = await request.post('/api/login').send(form).expect(200)
    expect(res.body.user.id).toBe(1)
  })
  it('login-info-admin fails', async () => {
    const res = await request.get('/api/login-info-admin').expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    const form = { email: 'admin@mail.test', password: '1234', remember: false }
    const res = await request.post('/api/login').send(form).expect(200)
    expect(res.body).toEqual({ user: { id: 4, name: 'Admin', home: 'admin', admin: true }})
  })
  it('login-info-admin works', async () => {
    const res = await request.get('/api/login-info-admin').expect(200)
    expect(res.body).toEqual({ user: { id: 4, name: 'Admin', home: 'admin', admin: true }})
  })

  // logout
  it('logout', async () => {
    await request.post('/api/logout').expect(200)
  })
  it('login-info fails after logout', async () => {
    const res = await request.get('/api/login-info').expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })

  // error
  it('invalid email', async () => {
    const form = { email: 'userx@mail.test', password: '1234', remember: false }
    const res = await request.post('/api/login').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_NOT_FOUND)
  })
  it('invalid password', async () => {
    const form = { email: 'user1@mail.test', password: 'xxxx', remember: false }
    const res = await request.post('/api/login').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_WRONG)
  })
})
