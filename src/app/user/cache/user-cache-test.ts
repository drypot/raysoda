import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import { UserCache } from './user-cache.js'
import { insertUserDBFixture1 } from '../db/user-db-fixture.js'

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
    await insertUserDBFixture1(udb)
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
      expect(uc.getStrictlyCachedByHome('user1')?.home).toBe(undefined)
      expect((await uc.getCachedByHome('user1'))?.home).toBe('user1')
      expect(uc.getStrictlyCachedByHome('user1')?.home).toBe('user1')
    })
  })

  describe('getCachedByEmail', () => {
    beforeEach(() => {
      uc.resetCache()
    })
    it('should work', async () => {
      expect(uc.getStrictlyCachedByHome('user1')?.home).toBe(undefined)
      expect((await uc.getCachedByEmail('user1@mail.test'))?.home).toBe('user1')
      expect(uc.getStrictlyCachedByHome('user1')?.home).toBe('user1')
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
