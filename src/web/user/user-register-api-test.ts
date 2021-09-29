import { Config, configFrom } from '../../_config/config.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserRegisterApi } from './user-register-api.js'
import {
  EMAIL_DUPE,
  EMAIL_RANGE,
  HOME_DUPE,
  HOME_RANGE,
  NAME_DUPE,
  NAME_RANGE,
  PASSWORD_RANGE
} from '../../_error/error-user.js'

describe('User Register Api', () => {

  let config: Config

  let db: DB
  let udb: UserDB

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)

    web = await Express2.from(config).start()
    registerUserRegisterApi(web, udb)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('post new user', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('post new user', async () => {
      const form = { name: 'User Y', email: 'usery@mail.test', password: '1234' }
      const res = await request.post('/api/user-register').send(form).expect(200)
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
      const res = await request.post('/api/user-register').send(form).expect(200)
      expect(res.body.err).toContain(NAME_RANGE)
      expect(res.body.err).toContain(HOME_RANGE)
      expect(res.body.err).toContain(EMAIL_RANGE)
      expect(res.body.err).toContain(PASSWORD_RANGE)
    })
    it('dupe check works', async () => {
      const form = { name: 'User 2', email: 'user2@mail.test', password: '1234' }
      const res = await request.post('/api/user-register').send(form).expect(200)
      expect(res.body.err).toContain(NAME_DUPE)
      expect(res.body.err).toContain(HOME_DUPE)
      expect(res.body.err).toContain(EMAIL_DUPE)
    })
  })

})