import { insertUserFix1 } from '../fixture/user-fix'
import { UserCache } from './user-cache'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../../oman/oman'

describe('UserCache', () => {

  let uc: UserCache

  beforeAll(async () => {
    omanNewSessionForTest()
    uc = await omanGetObject('UserCache') as UserCache
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  beforeAll(async () => {
    await uc.udb.dropTable()
    await uc.udb.createTable()
    await insertUserFix1(uc.udb)
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
