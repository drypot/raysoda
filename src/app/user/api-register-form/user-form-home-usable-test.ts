import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import { checkHomeDB, HOME_DUPE } from './user-form.js'
import { FormError } from '../../../lib/base/error2.js'
import { insertUserFix1 } from '../db/user-db-fixture.js'

describe('UserForm', () => {

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

  describe('checkHomeDB', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix1(udb)
    })
    it('ok if available', async () => {
      const errs: FormError[] = []
      await checkHomeDB(udb, 0, 'alice', errs)
      expect(errs.length).toBe(0)
    })
    it('ok if same entity', async () => {
      const errs: FormError[] = []
      await checkHomeDB(udb, 1, 'User 1', errs)
      expect(errs.length).toBe(0)
    })
    it('ok if same entity 2', async () => {
      const errs: FormError[] = []
      await checkHomeDB(udb, 1, 'user1', errs)
      expect(errs.length).toBe(0)
    })
    it('fail if in use', async () => {
      const errs: FormError[] = []
      await checkHomeDB(udb, 0, 'user1', errs)
      expect(errs).toContain(HOME_DUPE)
    })
    it('fail if in use 2', async () => {
      const errs: FormError[] = []
      await checkHomeDB(udb, 0, 'User 1', errs)
      expect(errs).toContain(HOME_DUPE)
    })
  })

})
