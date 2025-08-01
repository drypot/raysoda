import { USER1 } from './fixture/user-fix.js'
import { UserCache } from './user-cache.js'

describe('UserCache', () => {

  const cache = new UserCache()

  it('user1 not exists', () => {
    const user = cache.getCachedById(1)
    expect(user).toBe(undefined)
  })
  it('user1 not exists by home', () => {
    const user = cache.getCachedByHome('user1')
    expect(user).toBe(undefined)
  })
  it('cache user1', () => {
    cache.cacheUser(USER1)
  })
  it('user1 exists', () => {
    const user = cache.getCachedById(1)
    expect(user?.id).toBe(1)
  })
  it('user1 exists by home', () => {
    const user = cache.getCachedByHome(USER1.home)
    expect(user?.id).toBe(1)
  })
  it('delete user1', () => {
    cache.deleteCacheById(1)
  })
  it('user1 deleted', () => {
    const user = cache.getCachedById(1)
    expect(user).toBe(undefined)
  })

})
