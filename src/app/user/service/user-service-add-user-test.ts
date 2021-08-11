import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import {
  EMAIL_DUPE,
  EMAIL_EMPTY,
  EMAIL_PATTERN,
  NAME_DUPE,
  NAME_EMPTY,
  NAME_RANGE,
  newUserForm,
  PASSWORD_RANGE
} from '../form/user-form.js'
import { addUserService, checkPasswordHash } from './user-service.js'
import { insertUserDBFixture } from '../db/user-db-fixture.js'
import { FormError } from '../../../lib/base/error2.js'

describe('UserService', () => {

  let config: Config
  let db: DB
  let udb: UserDB

  beforeAll(async () => {
    config = loadConfig('config/app-test.json')
    db = new DB(config)
    udb = new UserDB(db)
    await db.createDatabase()
  })

  afterAll(async () => {
    await db.close()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserDBFixture(udb)
  })

  describe('addUserService', () => {
    it('should work for valid new', async () => {
      const form = newUserForm({
        name: 'Jon Snow',
        home: 'jon',
        email: 'jon@mail.com',
        password: '1234',
        profile: '',
      })
      let user = await addUserService(udb, form)
      expect(user.id).toBe(2)

      const user2 = await udb.findUserById(2)
      if (!user2) throw new Error('user not found')
      expect(user2.name).toBe('Jon Snow')
      expect(user2.home).toBe('jon')
      expect(user2.email).toBe('jon@mail.com')
      expect(await checkPasswordHash('1234', user2.hash)).toBe(true)
      expect(user2.status).toBe('v')
      expect(user2.admin).toBe(false)
    })
    it('should fail when name is empty', async () => {
      try {
        const form = newUserForm({ name: '', })
        await addUserService(udb, form)
        fail('should throw form error')
      } catch (errs) {
        expect(errs as FormError[]).toContain(NAME_EMPTY)
      }
    })
    it('should fail when name is long', async () => {
      try {
        const form = newUserForm({ name: 'x'.repeat(33), })
        await addUserService(udb, form)
        fail('should throw form error')
      } catch (errs) {
        expect(errs as FormError[]).toContain(NAME_RANGE)
      }
    })
    it('should fail when name is in use', async () => {
      try {
        const form = newUserForm({ name: 'Alice Liddell', })
        await addUserService(udb, form)
        fail('should throw form error')
      } catch (errs) {
        expect(errs as FormError[]).toContain(NAME_DUPE)
      }
    })
    it('should fail when name is in use 2', async () => {
      try {
        const form = newUserForm({ name: 'alice', })
        await addUserService(udb, form)
        fail('should throw form error')
      } catch (errs) {
        expect(errs as FormError[]).toContain(NAME_DUPE)
      }
    })
    it('should fail when email is empty', async () => {
      try {
        const form = newUserForm({ email: '', })
        await addUserService(udb, form)
        fail('should throw form error')
      } catch (errs) {
        expect(errs as FormError[]).toContain(EMAIL_EMPTY)
      }
    })
    it('should fail when email is invalid', async () => {
      try {
        const form = newUserForm({ email: 'abc.mail.com', })
        await addUserService(udb, form)
        fail('should throw form error')
      } catch (errs) {
        expect(errs as FormError[]).toContain(EMAIL_PATTERN)
      }
    })
    it('should fail when email is in use', async () => {
      try {
        const form = newUserForm({ email: 'alice@mail.com', })
        await addUserService(udb, form)
        fail('should throw form error')
      } catch (errs) {
        expect(errs as FormError[]).toContain(EMAIL_DUPE)
      }
    })
    it('should fail when password is short', async () => {
      try {
        const form = newUserForm({ password: '123', })
        await addUserService(udb, form)
        fail('should throw form error')
      } catch (errs) {
        expect(errs as FormError[]).toContain(PASSWORD_RANGE)
      }
    })
    it('should fail when password is long', async () => {
      try {
        const form = newUserForm({ password: 'x'.repeat(33), })
        await addUserService(udb, form)
        fail('should throw form error')
      } catch (errs) {
        expect(errs as FormError[]).toContain(PASSWORD_RANGE)
      }
    })
  })

})
