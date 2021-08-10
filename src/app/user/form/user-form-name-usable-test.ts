import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { waterfall } from '../../../lib/base/async2.js'
import { newUser } from '../entity/user-entity.js'
import { UserDB } from '../db/user-db.js'
import { checkUserNameUsable, NAME_DUPE } from './user-form.js'
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

  describe('checkUserNameUsable', () => {
    it('should ok when name is not in use', async () => {
      const errs: FormError[] = []
      await checkUserNameUsable(udb, 0, 'Jon', errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when name is in use', async () => {
      const errs: FormError[] = []
      await checkUserNameUsable(udb, 0, 'Alice Liddell', errs)
      expect(errs).toContain(NAME_DUPE)
    })
    it('should fail when name is in use 2', async () => {
      const errs: FormError[] = []
      await checkUserNameUsable(udb, 0, 'alice', errs)
      expect(errs).toContain(NAME_DUPE)
    })
    it('should ok when name is mine', async () => {
      const errs: FormError[] = []
      await checkUserNameUsable(udb, 1, 'Alice Liddell', errs)
      expect(errs.length).toBe(0)
    })
    it('should ok when name is mine 2', async () => {
      const errs: FormError[] = []
      await checkUserNameUsable(udb, 1, 'alice', errs)
      expect(errs.length).toBe(0)
    })
  })

})
