import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { MSG_USER_NOT_FOUND, UserDB } from '../db/user-db.js'
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
import { insertUserDBFixture1 } from '../db/user-db-fixture.js'
import { FormError } from '../../../lib/base/error2.js'
import { registerUser } from './user-service.js'
import { checkPasswordHash } from '../entity/user-password.js'

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
    await insertUserDBFixture1(udb)
  })

  describe('registerUser', () => {
    it('should work when form valid', async () => {
      const form = newUserForm({
        name: 'User X', home: 'userx', email: 'userx@mail.test', password: '1234', profile: '',
      })
      const errs = [] as FormError[]
      let user = await registerUser(udb, form, errs)
      if (!user) throw new Error(MSG_USER_NOT_FOUND)
      const user2 = await udb.findUserById(user.id)
      if (!user2) throw new Error(MSG_USER_NOT_FOUND)
      expect(user2.name).toBe('User X')
      expect(user2.home).toBe('userx')
      expect(user2.email).toBe('userx@mail.test')
      expect(await checkPasswordHash('1234', user2.hash)).toBe(true)
      expect(user2.status).toBe('v')
      expect(user2.admin).toBe(false)
    })
    it('should fail when name is empty', async () => {
      const form = newUserForm({ name: '', })
      const errs = [] as FormError[]
      await registerUser(udb, form, errs)
      expect(errs).toContain(NAME_EMPTY)
    })
    it('should fail when name is long', async () => {
      const form = newUserForm({ name: 'x'.repeat(33), })
      const errs = [] as FormError[]
      await registerUser(udb, form, errs)
      expect(errs).toContain(NAME_RANGE)
    })
    it('should fail when name is in use', async () => {
      const errs = [] as FormError[]
      const form = newUserForm({ name: 'User 1', })
      await registerUser(udb, form, errs)
      expect(errs).toContain(NAME_DUPE)
    })
    it('should fail when name is in use 2', async () => {
      const errs = [] as FormError[]
      const form = newUserForm({ name: 'user1', })
      await registerUser(udb, form, errs)
      expect(errs).toContain(NAME_DUPE)
    })
    it('should fail when email is empty', async () => {
      const errs = [] as FormError[]
      const form = newUserForm({ email: '', })
      await registerUser(udb, form, errs)
      expect(errs).toContain(EMAIL_EMPTY)
    })
    it('should fail when email is invalid', async () => {
      const errs = [] as FormError[]
      const form = newUserForm({ email: 'abc.mail.test', })
      await registerUser(udb, form, errs)
      expect(errs).toContain(EMAIL_PATTERN)
    })
    it('should fail when email is in use', async () => {
      const errs = [] as FormError[]
      const form = newUserForm({ email: 'user1@mail.test', })
      await registerUser(udb, form, errs)
      expect(errs).toContain(EMAIL_DUPE)
    })
    it('should fail when password is short', async () => {
      const errs = [] as FormError[]
      const form = newUserForm({ password: '123', })
      await registerUser(udb, form, errs)
      expect(errs).toContain(PASSWORD_RANGE)
    })
    it('should fail when password is long', async () => {
      const errs = [] as FormError[]
      const form = newUserForm({ password: 'x'.repeat(33), })
      await registerUser(udb, form, errs)
      expect(errs).toContain(PASSWORD_RANGE)
    })
  })

})
