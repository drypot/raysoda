import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../../lib/db/db.js'
import { UserDB } from '../../db/user-db.js'
import {
  EMAIL_DUPE,
  EMAIL_EMPTY,
  EMAIL_PATTERN,
  NAME_DUPE,
  NAME_EMPTY,
  NAME_RANGE,
  PASSWORD_RANGE
} from '../register-form/user-form.js'
import { insertUserFix1 } from '../../db/user-db-fixture.js'
import { FormError } from '../../../../lib/base/error2.js'
import { Express2 } from '../../../../lib/express/express2.js'
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
      await insertUserFix1(udb)
    })
    it('post new user should work', async () => {
      const form = { name: 'User Y', email: 'usery@mail.test', password: '1234' }
      const res = await request.post('/api/user').send(form)
      expect(res.body.id).toBe(2)
    })
    it('check db', async () => {
      const user = await udb.findUserById(2)
      expect(user?.name).toBe('User Y')
    })

    it('fails if name empty', async () => {
      const form = { name: '', email: 'userx@mail.test', password: '1234' }
      const res = await request.post('/api/user').send(form)
      const errs: FormError[] = res.body.err
      expect(errs).toContain(NAME_EMPTY)
    })
    it('fails if name long', async () => {
      const form = { name: 'x'.repeat(33), email: 'userx@mail.test', password: '1234' }
      const res = await request.post('/api/user').send(form)
      const errs: FormError[] = res.body.err
      expect(errs).toContain(NAME_RANGE)
    })
    it('fails if name in use', async () => {
      const form = { name: 'User 1', email: 'userx@mail.test', password: '1234' }
      const res = await request.post('/api/user').send(form)
      const errs: FormError[] = res.body.err
      expect(errs).toContain(NAME_DUPE)
    })
    it('fails if name in use 2', async () => {
      const form = { name: 'user1', email: 'userx@mail.test', password: '1234' }
      const res = await request.post('/api/user').send(form)
      const errs: FormError[] = res.body.err
      expect(errs).toContain(NAME_DUPE)
    })

    it('fails if email empty', async () => {
      const form = { name: 'User X', email: '', password: '1234' }
      const res = await request.post('/api/user').send(form)
      const errs: FormError[] = res.body.err
      expect(errs).toContain(EMAIL_EMPTY)
    })
    it('fails if email format invalid', async () => {
      const form = { name: 'User X', email: 'userx.mail.test', password: '1234' }
      const res = await request.post('/api/user').send(form)
      const errs: FormError[] = res.body.err
      expect(errs).toContain(EMAIL_PATTERN)
    })
    it('fails if email in use', async () => {
      const form = { name: 'User X', email: 'user1@mail.test', password: '1234' }
      const res = await request.post('/api/user').send(form)
      const errs: FormError[] = res.body.err
      expect(errs).toContain(EMAIL_DUPE)
    })

    it('fails if password short', async () => {
      const form = { name: 'User X', email: 'userx@mail.test', password: '123' }
      const res = await request.post('/api/user').send(form)
      const errs: FormError[] = res.body.err
      expect(errs).toContain(PASSWORD_RANGE)
    })
    it('fails if password long', async () => {
      const form = { name: 'User X', email: 'userx@mail.test', password: 'x'.repeat(33) }
      const res = await request.post('/api/user').send(form)
      const errs: FormError[] = res.body.err
      expect(errs).toContain(PASSWORD_RANGE)
    })
  })

})
