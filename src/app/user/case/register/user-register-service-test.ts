import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../../lib/db/db.js'
import { MSG_USER_NOT_FOUND, UserDB } from '../../db/user-db.js'
import {
  EMAIL_DUPE,
  EMAIL_EMPTY,
  EMAIL_PATTERN,
  NAME_DUPE,
  NAME_EMPTY,
  NAME_RANGE,
  PASSWORD_RANGE,
  userFormOf
} from '../register-form/user-form.js'
import { insertUserFix1 } from '../../db/user-db-fixture.js'
import { FormError } from '../../../../lib/base/error2.js'
import { userRegisterService } from './user-register-service.js'
import { checkHash } from '../../../../lib/base/hash.js'

describe('UserRegisterService', () => {

  let config: Config
  let db: DB
  let udb: UserDB

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('userRegisterService', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix1(udb)
    })
    it('ok if form valid', async () => {
      const form = userFormOf({
        name: 'User X', home: 'userx', email: 'userx@mail.test', password: '1234', profile: '',
      })
      const errs: FormError[] = []
      const user = await userRegisterService(udb, form, errs)
      if (!user) throw new Error(MSG_USER_NOT_FOUND)
    })
    it('can be checked', async () => {
      const user = await udb.findUserByHome('userx')
      if (!user) throw new Error(MSG_USER_NOT_FOUND)
      expect(user.name).toBe('User X')
      expect(user.home).toBe('userx')
      expect(user.email).toBe('userx@mail.test')
      expect(await checkHash('1234', user.hash)).toBe(true)
      expect(user.status).toBe('v')
      expect(user.admin).toBe(false)
    })
    it('fail if name empty', async () => {
      const form = userFormOf({ name: '', })
      const errs: FormError[] = []
      await userRegisterService(udb, form, errs)
      expect(errs).toContain(NAME_EMPTY)
    })
    it('fail if name is long', async () => {
      const form = userFormOf({ name: 'x'.repeat(33), })
      const errs: FormError[] = []
      await userRegisterService(udb, form, errs)
      expect(errs).toContain(NAME_RANGE)
    })
    it('fail if in use', async () => {
      const errs: FormError[] = []
      const form = userFormOf({ name: 'User 1', })
      await userRegisterService(udb, form, errs)
      expect(errs).toContain(NAME_DUPE)
    })
    it('fail if in use 2', async () => {
      const errs: FormError[] = []
      const form = userFormOf({ name: 'user1', })
      await userRegisterService(udb, form, errs)
      expect(errs).toContain(NAME_DUPE)
    })
    it('fail if email empty', async () => {
      const errs: FormError[] = []
      const form = userFormOf({ email: '', })
      await userRegisterService(udb, form, errs)
      expect(errs).toContain(EMAIL_EMPTY)
    })
    it('fail if email format invalid', async () => {
      const errs: FormError[] = []
      const form = userFormOf({ email: 'abc.mail.test', })
      await userRegisterService(udb, form, errs)
      expect(errs).toContain(EMAIL_PATTERN)
    })
    it('fail if email in use', async () => {
      const errs: FormError[] = []
      const form = userFormOf({ email: 'user1@mail.test', })
      await userRegisterService(udb, form, errs)
      expect(errs).toContain(EMAIL_DUPE)
    })
    it('fail if password short', async () => {
      const errs: FormError[] = []
      const form = userFormOf({ password: '123', })
      await userRegisterService(udb, form, errs)
      expect(errs).toContain(PASSWORD_RANGE)
    })
    it('fail if password long', async () => {
      const errs: FormError[] = []
      const form = userFormOf({ password: 'x'.repeat(33), })
      await userRegisterService(udb, form, errs)
      expect(errs).toContain(PASSWORD_RANGE)
    })
  })

})
