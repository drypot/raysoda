// user cache

import { User } from './domain/user-domain.js'
import { UserDB } from './db/user-db.js'

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

  getCached(id: number, done: (err: any, user?: User) => void) {
    const user = this.userIdMap.get(id)
    if (user) {
      return done(null, user)
    }
    this.udb.findUserById(id, (err, user) => {
      if (err) return done(err)
      if (user) this.cache(user)
      done(null, user)
    })
  }

  getStrictlyCached(id: number) {
    return this.userIdMap.get(id)
  }

  getCachedByHome(home: string, done: (err: any, user?: User) => void) {
    const user = this.userHomeMap.get(home.toLowerCase())
    if (user) {
      return done(null, user)
    }
    this.udb.findUserByHome(home, (err, user) => {
      if (err) return done(err)
      if (user) this.cache(user)
      done(null, user)
    })
  }

  getStrictlyCachedByHome(home: string) {
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
