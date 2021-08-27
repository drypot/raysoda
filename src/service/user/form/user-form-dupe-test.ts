import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { checkEmailDupe, checkHomeDupe, checkNameDupe, EMAIL_DUPE, HOME_DUPE, NAME_DUPE } from './user-form.js'
import { FormError } from '../../../lib/base/error2.js'
import { insertUserFix1 } from '../../../db/user/user-db-fixture.js'

describe('User Form', () => {

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

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserFix1(udb)
  })

  describe('check name dupe', () => {
    it('err if in use', async () => {
      const errs: FormError[] = []
      await checkNameDupe(udb, 0, 'User 1', errs)
      expect(errs).toContain(NAME_DUPE)
    })
    it('err if in use 2', async () => {
      const errs: FormError[] = []
      await checkNameDupe(udb, 0, 'user1', errs)
      expect(errs).toContain(NAME_DUPE)
    })
    it('ok if available', async () => {
      const errs: FormError[] = []
      await checkNameDupe(udb, 0, 'alice', errs)
      expect(errs.length).toBe(0)
    })
    it('ok if same entity', async () => {
      const errs: FormError[] = []
      await checkNameDupe(udb, 1, 'User 1', errs)
      expect(errs.length).toBe(0)
    })
    it('ok if same entity 2', async () => {
      const errs: FormError[] = []
      await checkNameDupe(udb, 1, 'user1', errs)
      expect(errs.length).toBe(0)
    })
  })


  describe('check home dupe', () => {
    it('err if in use', async () => {
      const errs: FormError[] = []
      await checkHomeDupe(udb, 0, 'user1', errs)
      expect(errs).toContain(HOME_DUPE)
    })
    it('err if in use 2', async () => {
      const errs: FormError[] = []
      await checkHomeDupe(udb, 0, 'User 1', errs)
      expect(errs).toContain(HOME_DUPE)
    })
    it('ok if available', async () => {
      const errs: FormError[] = []
      await checkHomeDupe(udb, 0, 'alice', errs)
      expect(errs.length).toBe(0)
    })
    it('ok if same entity', async () => {
      const errs: FormError[] = []
      await checkHomeDupe(udb, 1, 'User 1', errs)
      expect(errs.length).toBe(0)
    })
    it('ok if same entity 2', async () => {
      const errs: FormError[] = []
      await checkHomeDupe(udb, 1, 'user1', errs)
      expect(errs.length).toBe(0)
    })
  })

  describe('check email dupe', () => {
    it('err if email in use', async () => {
      const errs: FormError[] = []
      await checkEmailDupe(udb, 0, 'user1@mail.test', errs)
      expect(errs).toContain(EMAIL_DUPE)
    })
    it('ok if available', async () => {
      const errs: FormError[] = []
      await checkEmailDupe(udb, 0, 'userx@mail.test', errs)
      expect(errs.length).toBe(0)
    })
    it('ok if same entity', async () => {
      const errs: FormError[] = []
      await checkEmailDupe(udb, 1, 'user1@mail.test', errs)
      expect(errs.length).toBe(0)
    })
  })
})
