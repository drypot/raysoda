import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import {
  EMAIL_DUPE,
  EMAIL_EMPTY,
  EMAIL_PATTERN,
  HOME_DUPE,
  HOME_EMPTY,
  NAME_DUPE,
  NAME_EMPTY,
  PASSWORD_EMPTY
} from '../register-form/user-form.js'
import { insertUserFix1 } from '../db/user-db-fixture.js'
import { FormError } from '../../../lib/base/error2.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserRegisterApi } from './user-register-api.js'

describe('UserRegisterApi', () => {

  let config: Config

  let db: DB
  let udb: UserDB

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)

    web = Express2.from(config)
    registerUserRegisterApi(web, udb)
    await web.start()
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('register new user', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix1(udb)
    })
    it('should work if form valid', async () => {
      const form = { name: 'User X', email: 'userx@mail.test', password: '1234' }
      const res = await request.post('/api/user').send(form)
      expect(res.body.id).toBe(2)
    })
    it('can be checked', async () => {
      const user = await udb.findUserById(2)
      expect(user?.name).toBe('User X')
    })
    it('fail if form empty', async () => {
      const form = { name: '', email: '', password: '' }
      const res = await request.post('/api/user').send(form)
      expect(res.body.errType).toBe('array')
      const errs: FormError[] = res.body.err
      expect(errs).toContain(NAME_EMPTY)
      expect(errs).toContain(HOME_EMPTY)
      expect(errs).toContain(EMAIL_EMPTY)
      expect(errs).toContain(PASSWORD_EMPTY)
    })
    it('fail if in use', async () => {
      const form = { name: 'User 1', email: 'user1@mail.test', password: '1234' }
      const res = await request.post('/api/user').send(form)
      expect(res.body.errType).toBe('array')
      const errs: FormError[] = res.body.err
      expect(errs).toContain(NAME_DUPE)
      expect(errs).toContain(HOME_DUPE)
      expect(errs).toContain(EMAIL_DUPE)
    })
    it('fail if email is invalid', async () => {
      const form = { name: 'Han Solo', email: 'solo.mail.test', password: '1234' }
      const res = await request.post('/api/user').send(form)
      expect(res.body.errType).toBe('array')
      const errs: FormError[] = res.body.err
      expect(errs).toContain(EMAIL_PATTERN)
    })
  })

})
