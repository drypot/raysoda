import { Config, loadConfig } from '../../config/config.js'
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
} from '../form/user-form.js'
import { insertUserDBFixture1 } from '../db/user-db-fixture.js'
import { FormError } from '../../../lib/base/error2.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { initUserRegisterApi } from './user-register-api.js'

describe('UserRegisterApi', () => {

  let config: Config

  let db: DB
  let udb: UserDB

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = loadConfig('config/app-test.json')

    db = new DB(config)
    udb = new UserDB(db)
    await db.createDatabase()

    web = new Express2(config)
    initUserRegisterApi(udb, web)
    await web.start()
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserDBFixture1(udb)
  })

  // Pages

  describe('page /user/register', () => {
    it('should work', async () => {
      await request.get('/user/register').expect(200).expect(/<title>Register/)
    })
  })

  describe('page /user/register-done', () => {
    it('should work', async () => {
      await request.get('/user/register-done').expect(200).expect(/<title>Registered/)
    })
  })

  // Api

  describe('register new user: post /api/user', () => {
    it('should ok for valid new', async () => {
      const form = { name: 'User X', email: 'userx@mail.test', password: '1234' }
      const res = await request.post('/api/user').send(form)
      const id = res.body.id as number
      const user2 = await udb.findUserById(id)
      expect(user2?.name).toBe('User X')
    })
    it('should fail when fields are empty', async () => {
      const form = { name: '', email: '', password: '' }
      const res = await request.post('/api/user').send(form)
      expect(res.body.errType).toBe('array')
      expect(res.body.err as FormError[]).toContain(NAME_EMPTY)
      expect(res.body.err as FormError[]).toContain(HOME_EMPTY)
      expect(res.body.err as FormError[]).toContain(EMAIL_EMPTY)
      expect(res.body.err as FormError[]).toContain(PASSWORD_EMPTY)
    })
    it('should fail when fields are in use', async () => {
      const form = { name: 'User 1', email: 'user1@mail.test', password: '1234' }
      const res = await request.post('/api/user').send(form)
      expect(res.body.errType).toBe('array')
      expect(res.body.err as FormError[]).toContain(NAME_DUPE)
      expect(res.body.err as FormError[]).toContain(HOME_DUPE)
      expect(res.body.err as FormError[]).toContain(EMAIL_DUPE)
    })
    it('should fail when email is invalid', async () => {
      const form = { name: 'Han Solo', email: 'solo.mail.test', password: '1234' }
      const res = await request.post('/api/user').send(form)
      expect(res.body.errType).toBe('array')
      expect(res.body.err as FormError[]).toContain(EMAIL_PATTERN)
    })
  })

})