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
import { insertUserDBFixture } from '../db/user-db-fixture.js'
import { FormError } from '../../../lib/base/error2.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { initUserAPI } from './user-api.js'

describe('UserAPI', () => {

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
    initUserAPI(udb, web)
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
    await insertUserDBFixture(udb)
  })

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

  describe('post /api/user', () => {
    it('should work for valid new', async () => {
      const form = { name: 'Jon Snow', email: 'jon@mail.com', password: '1234' }
      const res = await request.post('/api/user').send(form)
      const id = res.body.id as number
      const user2 = await udb.findUserById(id)
      expect(user2?.name).toBe('Jon Snow')
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
      const form = { name: 'Alice Liddell', email: 'alice@mail.com', password: '1234' }
      const res = await request.post('/api/user').send(form)
      expect(res.body.errType).toBe('array')
      expect(res.body.err as FormError[]).toContain(NAME_DUPE)
      expect(res.body.err as FormError[]).toContain(HOME_DUPE)
      expect(res.body.err as FormError[]).toContain(EMAIL_DUPE)
    })
    it('should fail when email is invalid', async () => {
      const form = { name: 'Han Solo', email: 'solo.mail.com', password: '1234' }
      const res = await request.post('/api/user').send(form)
      expect(res.body.errType).toBe('array')
      expect(res.body.err as FormError[]).toContain(EMAIL_PATTERN)
    })
  })

})
