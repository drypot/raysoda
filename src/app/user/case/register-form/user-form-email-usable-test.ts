import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../../lib/db/db.js'
import { UserDB } from '../../db/user-db.js'
import { checkEmailDB, EMAIL_DUPE } from './user-form.js'
import { FormError } from '../../../../lib/base/error2.js'
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

  describe('checkEmailDB', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix1(udb)
    })
    it('checkEmailDB returns no err', async () => {
      const errs: FormError[] = []
      await checkEmailDB(udb, 0, 'userx@mail.test', errs)
      expect(errs.length).toBe(0)
    })
    it('no err if same entity', async () => {
      const errs: FormError[] = []
      await checkEmailDB(udb, 1, 'user1@mail.test', errs)
      expect(errs.length).toBe(0)
    })
    it('err if email in use', async () => {
      const errs: FormError[] = []
      await checkEmailDB(udb, 0, 'user1@mail.test', errs)
      expect(errs).toContain(EMAIL_DUPE)
    })
  })

})
