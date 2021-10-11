import { loadConfigSync } from '../../../_util/config-loader'
import { DB } from '../../_db/db'
import { UserDB } from '../user-db'
import { insertUserFix1 } from '../fixture/user-fix'
import { Config } from '../../../_type/config'
import { UserCache } from './user-cache'

describe('UserCache', () => {

  let config: Config
  let db: DB
  let udb: UserDB
  let uc: UserCache

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)
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
      uc.resetCache()
    })
    it('user1 not exists in cache', () => {
      const user = uc.getCachedByIdStrict(1)
      expect(user).toBe(undefined)
    })
    it('loads user1', async () => {
      const user = await uc.getCachedById(1)
      expect(user?.id).toBe(1)
    })
    it('user1 exists in cache', () => {
      const user = uc.getCachedByIdStrict(1)
      expect(user?.id).toBe(1)
    })
  })

  describe('getCachedByHome', () => {
    it('reset cache', async () => {
      uc.resetCache()
    })
    it('user1 not exists in cache', () => {
      const user = uc.getCachedByHomeStrict('user1')
      expect(user).toBe(undefined)
    })
    it('loads user1', async () => {
      const user = await uc.getCachedByHome('user1')
      expect(user?.home).toBe('user1')
    })
    it('user1 exists in cache', () => {
      const user = uc.getCachedByHomeStrict('user1')
      expect(user?.home).toBe('user1')
    })
  })

  describe('getCachedByEmailForce', () => {
    it('reset cache', async () => {
      uc.resetCache()
    })
    it('user1 not exists in cache', () => {
      const user = uc.getCachedByHomeStrict('user1')
      expect(user).toBe(undefined)
    })
    it('cache user1', async () => {
      const user = await uc.getCachedByEmailForce('user1@mail.test')
      expect(user?.home).toBe('user1')
    })
    it('change cached user1', () => {
      const user = uc.getCachedByHomeStrict('user1')
      if (!user) throw new Error()
      user.profile = 'yyyy'
    })
    it('check changed', () => {
      const user = uc.getCachedByHomeStrict('user1')
      expect(user?.profile).toBe('yyyy')
    })
    it('cache user1 again', async () => {
      const user = await uc.getCachedByEmailForce('user1@mail.test')
      expect(user?.home).toBe('user1')
    })
    it('check reloaded', () => {
      const user = uc.getCachedByHomeStrict('user1')
      expect(user?.profile).toBe('')
    })
  })

  describe('deleteCacheById', () => {
    it('reset cache', async () => {
      uc.resetCache()
    })
    it('load user1', async () => {
      const user = await uc.getCachedById(1)
      expect(user?.id).toBe(1)
    })
    it('user1 exists in cache', () => {
      const user = uc.getCachedByIdStrict(1)
      expect(user?.id).toBe(1)
    })
    it('delete user1 from cache', () => {
      uc.deleteCacheById(1)
    })
    it('user1 not exist in cache', () => {
      const user = uc.getCachedByIdStrict(1)
      expect(user?.id).toBe(undefined)
    })
  })

})
