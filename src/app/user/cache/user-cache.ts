import { User } from '../entity/user-entity.js'
import { UserDB } from '../db/user-db.js'

export class UserCache {

  private udb: UserDB
  private userIdMap = new Map
  private userHomeMap = new Map

  constructor(userdb: UserDB) {
    this.udb = userdb
  }

  resetCache() {
    this.userIdMap = new Map
    this.userHomeMap = new Map
  }

  cache(user: User) {
    this.userIdMap.set(user.id, user)
    this.userHomeMap.set(user.home.toLowerCase(), user)
  }

  async getCached(id: number): Promise<User|undefined> {
    let user = this.userIdMap.get(id)
    if (user) {
      return user
    }
    user = await this.udb.findUserById(id)
    if (user) this.cache(user)
    return user
  }

  getStrictlyCached(id: number): User | undefined {
    return this.userIdMap.get(id)
  }

  async getCachedByHome(home: string): Promise<User|undefined> {
    let user = this.userHomeMap.get(home.toLowerCase())
    if (user) {
      return user
    }
    user = await this.udb.findUserByHome(home)
    if (user) this.cache(user)
    return user
  }

  getStrictlyCachedByHome(home: string): User | undefined {
    return this.userHomeMap.get(home.toLowerCase())
  }

  deleteCache(id: number) {
    const user = this.userIdMap.get(id)
    if (user) {
      this.userIdMap.delete(id)
      this.userHomeMap.delete(user.home.toLowerCase())
    }
  }

}
