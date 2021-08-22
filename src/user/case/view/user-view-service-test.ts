import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../db/db.js'
import { MSG_USER_NOT_FOUND, UserDB } from '../../db/user-db.js'
import { insertUserFix1 } from '../../db/user-db-fixture.js'
import { userViewService } from './user-view-service.js'

describe('UserViewService', () => {

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

  describe('userViewService', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix1(udb)
    })
    it('return user info if id valid', async () => {
      const user = await userViewService(udb, 1, false)
      if (!user) throw new Error(MSG_USER_NOT_FOUND)
      expect(user.id).toBe(1)
      expect(user.home).toBe('user1')
      expect(user.email).toBe(undefined)
      expect(user.adate).toBe(undefined)
    })
    it('return with email if privInfo true', async () => {
      const user = await userViewService(udb, 1, true)
      if (!user) throw new Error(MSG_USER_NOT_FOUND)
      expect(user.id).toBe(1)
      expect(user.home).toBe('user1')
      expect(user.email).toBe('user1@mail.test')
      expect(user.adate).toBeDefined()
    })
    it('return undefined if id invalid', async () => {
      const user = await userViewService(udb, 99, false)
      expect(user).toBe(undefined)
    })
  })

})
