import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../db/db.js'
import { UserDB } from '../../db/user-db.js'
import { checkHomeDB, HOME_DUPE } from './user-form.js'
import { FormError } from '../../../lib/base/error2.js'
import { insertUserFix1 } from '../../db/user-db-fixture.js'

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
    it('no err if home available', async () => {
      const errs: FormError[] = []
      await checkHomeDB(udb, 0, 'alice', errs)
      expect(errs.length).toBe(0)
    })
    it('no err if same entity', async () => {
      const errs: FormError[] = []
      await checkHomeDB(udb, 1, 'User 1', errs)
      expect(errs.length).toBe(0)
    })
    it('no err if same entity 2', async () => {
      const errs: FormError[] = []
      await checkHomeDB(udb, 1, 'user1', errs)
      expect(errs.length).toBe(0)
    })
    it('err if home in use', async () => {
      const errs: FormError[] = []
      await checkHomeDB(udb, 0, 'user1', errs)
      expect(errs).toContain(HOME_DUPE)
    })
    it('err if home in use 2', async () => {
      const errs: FormError[] = []
      await checkHomeDB(udb, 0, 'User 1', errs)
      expect(errs).toContain(HOME_DUPE)
    })
  })

})
