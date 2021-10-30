import { USER1, userFixInsert1 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('UserDB Cache', () => {

  let udb: UserDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable()
    await userFixInsert1(udb)
  })

  describe('getCachedById', () => {
    it('reset cache', async () => {
      udb.resetCache()
    })
    it('user1 not exists in cache', async () => {
      const user = await udb.getCachedByIdStrict(1)
      expect(user).toBe(undefined)
    })
    it('loads user1', async () => {
      const user = await udb.getCachedById(1)
      expect(user?.id).toBe(1)
    })
    it('user1 exists in cache', () => {
      const user = udb.getCachedByIdStrict(1)
      expect(user?.id).toBe(1)
    })
  })

  describe('getCachedByHome', () => {
    it('reset cache', async () => {
      udb.resetCache()
    })
    it('user1 not exists in cache', () => {
      const user = udb.getCachedByHomeStrict(USER1.home)
      expect(user).toBe(undefined)
    })
    it('loads user1', async () => {
      const user = await udb.getCachedByHome(USER1.home)
      expect(user?.home).toBe(USER1.home)
    })
    it('user1 exists in cache', () => {
      const user = udb.getCachedByHomeStrict(USER1.home)
      expect(user?.home).toBe(USER1.home)
    })
  })

  describe('After Update', () => {
    it('reset cache', async () => {
      udb.resetCache()
    })
    it('loads user1', async () => {
      const user = await udb.getCachedById(1)
      expect(user?.id).toBe(1)
    })
    it('profile is', () => {
      const user = udb.getCachedByIdStrict(1)
      expect(user?.profile).toBe('')
    })
    it('update user1', async () => {
      await udb.updateUser(1, { profile: 'yyy' })
    })
    it('cache not exists after update', () => {
      const user = udb.getCachedByIdStrict(1)
      expect(user).toBeUndefined()
    })
    it('loads user1 again', async () => {
      const user = await udb.getCachedById(1)
      expect(user?.id).toBe(1)
    })
    it('profile is', () => {
      const user = udb.getCachedByIdStrict(1)
      expect(user?.profile).toBe('yyy')
    })
  })

})
