import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { waterfall } from '../../../lib/base/async2.js'
import { newUser } from '../entity/user-entity.js'
import { UserDB } from '../db/user-db.js'
import { checkUserEmailUsable, EMAIL_DUPE } from './user-form.js'
import { FormError } from '../../../lib/base/error2.js'
import { insertUserDBFixture } from '../db/user-db-fixture.js'

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
    await insertUserDBFixture(udb)
  })

  describe('checkUserEmailUsable', () => {
    it('should ok when email is not in use', async () => {
      const errs: FormError[] = []
      await checkUserEmailUsable(udb, 0, 'snow@mail.com', errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when email is in use', async () => {
      const errs: FormError[] = []
      await checkUserEmailUsable(udb, 0, 'alice@mail.com', errs)
      expect(errs).toContain(EMAIL_DUPE)
    })
    it('should ok when email is mine', async () => {
      const errs: FormError[] = []
      await checkUserEmailUsable(udb, 1, 'alice@mail.com', errs)
      expect(errs.length).toBe(0)
    })
  })

})
