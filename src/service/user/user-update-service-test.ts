import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { FormError } from '../../lib/base/error2.js'
import { userUpdateService } from './user-update-service.js'
import { checkHash } from '../../lib/base/hash.js'
import {
  EMAIL_DUPE,
  EMAIL_RANGE,
  HOME_DUPE,
  HOME_RANGE,
  NAME_DUPE,
  NAME_RANGE,
  PASSWORD_RANGE,
  userUpdateFormOf
} from './form/user-form.js'

describe('User Update Service', () => {

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

  describe('userUpdateService', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('update user1', async () => {
      const form = userUpdateFormOf({
        name: 'User X', home: 'userx', email: 'userx@mail.test',
        password: '', profile: 'profile x'
      })
      const errs: FormError[] = []
      await userUpdateService(udb, 1, form, errs)
      expect(errs.length).toBe(0)
    })
    it('check db', async () => {
      const user = await udb.findUserById(1)
      if (!user) throw new Error()
      expect(user.name).toBe('User X')
      expect(user.home).toBe('userx')
      expect(user.email).toBe('userx@mail.test')
      expect(await checkHash('1234', user.hash)).toBe(true)
      expect(user.profile).toBe('profile x')
    })
    it('check cache', async () => {
      const user = await udb.getCachedById(1)
      if (!user) throw new Error()
      expect(user.name).toBe('User X')
      expect(user.home).toBe('userx')
      expect(user.email).toBe('userx@mail.test')
      expect(await checkHash('1234', user.hash)).toBe(true)
      expect(user.profile).toBe('profile x')
    })
    it('update user1 password', async () => {
      const form = userUpdateFormOf({
        name: 'User X', home: 'userx', email: 'userx@mail.test',
        password: '5678', profile: 'profile x'
      })
      const errs: FormError[] = []
      await userUpdateService(udb, 1, form, errs)
      expect(errs.length).toBe(0)
    })
    it('check db', async () => {
      const user = await udb.findUserById(1)
      if (!user) throw new Error()
      expect(await checkHash('1234', user.hash)).toBe(false)
      expect(await checkHash('5678', user.hash)).toBe(true)
    })
    it('check cache', async () => {
      const user = await udb.getCachedById(1)
      if (!user) throw new Error()
      expect(await checkHash('1234', user.hash)).toBe(false)
      expect(await checkHash('5678', user.hash)).toBe(true)
    })
    it('format check works', async () => {
      const s33 = 'x'.repeat(33)
      const s65 = 'x'.repeat(66)
      const form = userUpdateFormOf({
        name: s33, home: s33, email: s65, password: s33, profile: ''
      })
      const errs: FormError[] = []
      await userUpdateService(udb, 1, form, errs)
      expect(errs.length).toBe(4)
      expect(errs).toContain(NAME_RANGE)
      expect(errs).toContain(HOME_RANGE)
      expect(errs).toContain(EMAIL_RANGE)
      expect(errs).toContain(PASSWORD_RANGE)
    })
    it('dupe check works', async () => {
      const form = userUpdateFormOf({
        name: 'User 2', home: 'user2', email: 'user2@mail.test',
        password: '', profile: ''
      })
      const errs: FormError[] = []
      await userUpdateService(udb, 1, form, errs)
      expect(errs.length).toBe(3)
      expect(errs).toContain(NAME_DUPE)
      expect(errs).toContain(HOME_DUPE)
      expect(errs).toContain(EMAIL_DUPE)
    })
  })

})
