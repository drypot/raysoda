import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import { checkUserEmailUsable, EMAIL_DUPE } from './user-form.js'
import { FormError } from '../../../lib/base/error2.js'
import { insertUserDBFixture1 } from '../db/user-db-fixture.js'

describe('UserForm', () => {

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

  describe('checkUserEmailUsable', () => {
    it('should ok when one entity', async () => {
      const errs: FormError[] = []
      await checkUserEmailUsable(udb, 1, 'user1@mail.test', errs)
      expect(errs.length).toBe(0)
    })
    it('should ok when valid', async () => {
      const errs: FormError[] = []
      await checkUserEmailUsable(udb, 0, 'userx@mail.test', errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when in use', async () => {
      const errs: FormError[] = []
      await checkUserEmailUsable(udb, 0, 'user1@mail.test', errs)
      expect(errs).toContain(EMAIL_DUPE)
    })
  })

})
