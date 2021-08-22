import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../db/db.js'
import { UserDB } from './user-db.js'
import { insertUserFix1 } from './user-db-fixture.js'

describe('UserCache', () => {

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

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserFix1(udb)
  })

  describe('getCachedById', () => {
    it('reset cache', async () => {
      udb.resetCache()
    })
    it('user1 not exists in cache', () => {
      const user = udb.getStrictlyCachedById(1)
      expect(user?.id).toBe(undefined)
    })
    it('loads user1', async () => {
      const user = await udb.getCachedById(1)
      expect(user?.id).toBe(1)
    })
    it('user1 exists in cache', () => {
      const user = udb.getStrictlyCachedById(1)
      expect(user?.id).toBe(1)
    })
  })

  describe('getCachedByHome', () => {
    it('reset cache', async () => {
      udb.resetCache()
    })
    it('user1 not exists in cache', () => {
      const user = udb.getStrictlyCachedByHome('user1')
      expect(user?.home).toBe(undefined)
    })
    it('loads user1', async () => {
      const user = await udb.getCachedByHome('user1')
      expect(user?.home).toBe('user1')
    })
    it('user1 exists in cache', () => {
      const user = udb.getStrictlyCachedByHome('user1')
      expect(user?.home).toBe('user1')
    })
  })

  describe('getRecachedByEmail', () => {
    it('reset cache', async () => {
      udb.resetCache()
    })
    it('user1 not exists in cache', () => {
      const user = udb.getStrictlyCachedByHome('user1')
      expect(user?.home).toBe(undefined)
    })
    it('recache user1', async () => {
      const user = await udb.getRecachedByEmail('user1@mail.test')
      expect(user?.home).toBe('user1')
    })
    it('change cached user1', () => {
      const user = udb.getStrictlyCachedByHome('user1')
      if (!user) throw new Error()
      user.profile = 'yyyy'
    })
    it('check changed', () => {
      const user = udb.getStrictlyCachedByHome('user1')
      expect(user?.profile).toBe('yyyy')
    })
    it('recache user1', async () => {
      const user = await udb.getRecachedByEmail('user1@mail.test')
      expect(user?.home).toBe('user1')
    })
    it('check reloaded', () => {
      const user = udb.getStrictlyCachedByHome('user1')
      expect(user?.profile).toBe('')
    })
  })

  describe('deleteCacheById', () => {
    it('reset cache', async () => {
      udb.resetCache()
    })
    it('load user1', async () => {
      const user = await udb.getCachedById(1)
      expect(user?.id).toBe(1)
    })
    it('user1 exists in cache', () => {
      const user = udb.getStrictlyCachedById(1)
      expect(user?.id).toBe(1)
    })
    it('delete user1 from cache', () => {
      udb.deleteCacheById(1)
    })
    it('user1 not exist in cache', () => {
      const user = udb.getStrictlyCachedById(1)
      expect(user?.id).toBe(undefined)
    })
  })

})
