import { insertUserFix1 } from './fixture/user-fix'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'
import { UserDB } from './user-db'

describe('UserDB Cache', () => {

  let udb: UserDB

  beforeAll(async () => {
    omanNewSessionForTest()
    udb = await omanGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable()
    await insertUserFix1(udb)
  })

  describe('findUserById', () => {
    it('reset cache', async () => {
      udb.resetCache()
    })
    it('user1 not exists in cache', () => {
      const user = udb.getCachedById(1)
      expect(user).toBe(undefined)
    })
    it('loads user1', async () => {
      const user = await udb.findUserById(1)
      expect(user?.id).toBe(1)
    })
    it('user1 exists in cache', () => {
      const user = udb.getCachedById(1)
      expect(user?.id).toBe(1)
    })
  })

  describe('findUserByHome', () => {
    it('reset cache', async () => {
      udb.resetCache()
    })
    it('user1 not exists in cache', () => {
      const user = udb.getCachedByHome('user1')
      expect(user).toBe(undefined)
    })
    it('loads user1', async () => {
      const user = await udb.findUserByHome('user1')
      expect(user?.home).toBe('user1')
    })
    it('user1 exists in cache', () => {
      const user = udb.getCachedByHome('user1')
      expect(user?.home).toBe('user1')
    })
  })

  describe('After Update', () => {
    it('reset cache', async () => {
      udb.resetCache()
    })
    it('loads user1', async () => {
      const user = await udb.findUserById(1)
      expect(user?.id).toBe(1)
    })
    it('profile is', () => {
      const user = udb.getCachedById(1)
      expect(user?.profile).toBe('')
    })
    it('update user1', async () => {
      await udb.updateUser(1, { profile: 'yyy' })
    })
    it('cache not exists after update', () => {
      const user = udb.getCachedById(1)
      expect(user).toBeUndefined()
    })
    it('loads user1 again', async () => {
      const user = await udb.findUserById(1)
      expect(user?.id).toBe(1)
    })
    it('profile is', () => {
      const user = udb.getCachedById(1)
      expect(user?.profile).toBe('yyy')
    })
  })

})
