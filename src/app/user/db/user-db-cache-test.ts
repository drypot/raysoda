import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from './user-db.js'
import { insertUserDBFixture1 } from './user-db-fixture.js'

describe('UserCache', () => {

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

  describe('getCachedById', () => {
    beforeEach(() => {
      udb.resetCache()
    })
    it('should work', async () => {
      expect(udb.getStrictlyCachedById(1)?.id).toBe(undefined)
      expect((await udb.getCachedById(1))?.id).toBe(1)
      expect(udb.getStrictlyCachedById(1)?.id).toBe(1)
    })
  })

  describe('getCachedByIdByHome', () => {
    beforeEach(() => {
      udb.resetCache()
    })
    it('should work', async () => {
      expect(udb.getStrictlyCachedByIdByHome('user1')?.home).toBe(undefined)
      expect((await udb.getCachedByIdByHome('user1'))?.home).toBe('user1')
      expect(udb.getStrictlyCachedByIdByHome('user1')?.home).toBe('user1')
    })
  })

  describe('getCachedByIdByEmail', () => {
    beforeEach(() => {
      udb.resetCache()
    })
    it('should work', async () => {
      expect(udb.getStrictlyCachedByIdByHome('user1')?.home).toBe(undefined)
      expect((await udb.getCachedByIdByEmail('user1@mail.test'))?.home).toBe('user1')
      expect(udb.getStrictlyCachedByIdByHome('user1')?.home).toBe('user1')
    })
  })

  describe('deleteCache', () => {
    beforeAll(() => {
      udb.resetCache()
    })
    it('should work', async () => {
      await udb.getCachedById(1)
      expect(udb.getStrictlyCachedById(1)?.id).toBe(1)
      udb.deleteCache(1)
      expect(udb.getStrictlyCachedById(1)?.id).toBe(undefined)
    })
  })
})
