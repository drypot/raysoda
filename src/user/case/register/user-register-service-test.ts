import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { MSG_USER_NOT_FOUND, UserDB } from '../../db/user-db.js'
import {
  EMAIL_DUPE,
  EMAIL_RANGE,
  HOME_DUPE,
  HOME_RANGE,
  NAME_DUPE,
  NAME_RANGE,
  PASSWORD_RANGE,
  userFormOf
} from '../register-form/user-form.js'
import { insertUserFix4 } from '../../db/user-db-fixture.js'
import { FormError } from '../../../lib/base/error2.js'
import { userRegisterService } from './user-register-service.js'
import { checkHash } from '../../../lib/base/hash.js'

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
      await insertUserFix4(udb)
    })
    it('register new user', async () => {
      const form = userFormOf({
        name: 'User X', home: 'userx', email: 'userx@mail.test', password: '1234', profile: '',
      })
      const errs: FormError[] = []
      const user = await userRegisterService(udb, form, errs)
      if (!user) throw new Error(MSG_USER_NOT_FOUND)
    })
    it('check db', async () => {
      const user = await udb.findUserByHome('userx')
      if (!user) throw new Error(MSG_USER_NOT_FOUND)
      expect(user.name).toBe('User X')
      expect(user.home).toBe('userx')
      expect(user.email).toBe('userx@mail.test')
      expect(await checkHash('1234', user.hash)).toBe(true)
      expect(user.status).toBe('v')
      expect(user.admin).toBe(false)
    })
    it('format check works', async () => {
      const s33 = 'x'.repeat(33)
      const s65 = 'x'.repeat(66)
      const form = {
        name: s33, home: s33, email: s65, password: s33, profile: ''
      }
      const errs: FormError[] = []
      const user = await userRegisterService(udb, form, errs)
      expect(errs.length).toBe(4)
      expect(errs).toContain(NAME_RANGE)
      expect(errs).toContain(HOME_RANGE)
      expect(errs).toContain(EMAIL_RANGE)
      expect(errs).toContain(PASSWORD_RANGE)
    })
    it('dupe check works', async () => {
      const form = {
        name: 'User 2', home: 'user2', email: 'user2@mail.test', password: '1234', profile: ''
      }
      const errs: FormError[] = []
      const user = await userRegisterService(udb, form, errs)
      expect(errs.length).toBe(3)
      expect(errs).toContain(NAME_DUPE)
      expect(errs).toContain(HOME_DUPE)
      expect(errs).toContain(EMAIL_DUPE)
    })
  })

})
