import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import { insertUserFix4 } from '../db/user-db-fixture.js'
import { USER_NOT_FOUND } from '../form/user-form.js'
import { deactivateUser } from './user-service.js'
import { FormError } from '../../../lib/base/error2.js'

describe('UserService', () => {

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

  describe('deactivateUser', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('user status should be "v"', async () => {
      const user = await udb.findUserById(1)
      expect(user?.status).toBe('v')
    })
    it('deactivate user', async () => {
      const errs: FormError[] = []
      await deactivateUser(udb, 1, errs)
      expect(errs.length).toBe(0)
    })
    it('user status should be "d"', async () => {
      const user = await udb.findUserById(1)
      expect(user?.status).toBe('d')
    })
    it('deactivate user should fail if id invalid', async () => {
      const errs: FormError[] = []
      await deactivateUser(udb, 999, errs)
      expect(errs).toContain(USER_NOT_FOUND)
    })
  })

})
