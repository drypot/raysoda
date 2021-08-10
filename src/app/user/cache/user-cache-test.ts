import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import { UserCache } from './user-cache.js'
import { waterfall } from '../../../lib/base/async2.js'
import { newUser, User } from '../entity/user-entity.js'
import { insertUserDBFixture } from '../db/user-db-fixture.js'

describe('UserCache', () => {

  let config: Config
  let db: DB
  let udb: UserDB
  let uc: UserCache

  beforeAll(async () => {
    config = loadConfig('config/app-test.json')
    db = new DB(config)
    udb = new UserDB(db)
    uc = new UserCache(udb)
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

  describe('getCached', () => {
    beforeEach(() => {
      uc.resetCache()
    })
    it('should work', async () => {
      expect(uc.getStrictlyCached(1)?.id).toBe(undefined)
      expect((await uc.getCached(1))?.id).toBe(1)
      expect(uc.getStrictlyCached(1)?.id).toBe(1)
    })
  })

  describe('getCachedByHome', () => {
    beforeEach(() => {
      uc.resetCache()
    })
    it('should work', async () => {
      expect(uc.getStrictlyCachedByHome('alice')?.home).toBe(undefined)
      expect((await uc.getCachedByHome('alice'))?.home).toBe('alice')
      expect(uc.getStrictlyCachedByHome('alice')?.home).toBe('alice')
    })
  })

  describe('deleteCache', () => {
    beforeAll(() => {
      uc.resetCache()
    })
    it('should work', async () => {
      await uc.getCached(1)
      expect(uc.getStrictlyCached(1)?.id).toBe(1)
      uc.deleteCache(1)
      expect(uc.getStrictlyCached(1)?.id).toBe(undefined)
    })
  })
})
