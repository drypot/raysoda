import { loadConfigSync } from '../../../../_util/config-loader.js'
import { DB } from '../../../../db/_db/db.js'
import { UserDB } from '../../../../db/user/user-db.js'
import { insertUserFix4 } from '../../../../db/user/fixture/user-fix.js'
import { Express2 } from '../../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserRegisterApi } from './user-register-api.js'
import {
  EMAIL_DUPE,
  EMAIL_RANGE,
  HOME_DUPE,
  HOME_RANGE,
  NAME_DUPE,
  NAME_RANGE,
  PASSWORD_RANGE
} from '../../../../_type/error-user.js'
import { Config } from '../../../../_type/config.js'

describe('UserRegisterApi', () => {

  let config: Config

  let db: DB
  let udb: UserDB

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)

    web = Express2.from(config)
    registerUserRegisterApi(web, udb)
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
  it('post new user', async () => {
    const form = { name: 'User Y', email: 'usery@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.id).toBe(5)
  })
  it('check db', async () => {
    const user = await udb.findUserById(5)
    expect(user?.name).toBe('User Y')
  })
  it('format check works', async () => {
    const s33 = 'x'.repeat(33)
    const s65 = 'x'.repeat(66)
    const form = { name: s33, email: s65, password: s33 }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(NAME_RANGE)
    expect(res.body.err).toContain(HOME_RANGE)
    expect(res.body.err).toContain(EMAIL_RANGE)
    expect(res.body.err).toContain(PASSWORD_RANGE)
  })
  it('dupe check works', async () => {
    const form = { name: 'User 2', email: 'user2@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(NAME_DUPE)
    expect(res.body.err).toContain(HOME_DUPE)
    expect(res.body.err).toContain(EMAIL_DUPE)
  })

})
