import { User } from '../../../_type/user'
import { UserDB } from '../user-db'
import { ObjMaker, objManGetObject } from '../../../objman/object-man'

// 20219-09-29, user cache 시스템을 날리려다 원복했다.
// user cache 는 MongoDB 에 join 없음 문제로 부터 시작된 것 같다.
// express session 이 object 를 저장하지 못하는 문제도 한몫했다.
// 현재는 req.session 에 uid 만 저장한다.
// 매 Request 가 도착할 때마다 res.locals.user 에 cached user 를 연결한다.
// 없애기 힘들 것 같다.

export const serviceObject: ObjMaker = async () => {
  const uc = UserCache.from(await objManGetObject('UserDB') as UserDB)
  return uc
}

export class UserCache {

  readonly udb: UserDB

  static from(udb: UserDB) {
    return new UserCache(udb)
  }

  private constructor(udb: UserDB) {
    this.udb = udb
  }

  private userIdMap = new Map
  private userHomeMap = new Map

  resetCache() {
    this.userIdMap = new Map
    this.userHomeMap = new Map
  }

  deleteCacheById(id: number) {
    const user = this.userIdMap.get(id)
    if (user) {
      this.userIdMap.delete(id)
      this.userHomeMap.delete(user.home.toLowerCase())
    }
  }

  async getCachedById(id: number) {
    let user = this.userIdMap.get(id)
    if (user) {
      return user as User
    }
    user = await this.udb.findUserById(id)
    if (user) this.cache(user)
    return user as User | undefined
  }

  getCachedByIdStrict(id: number) {
    return this.userIdMap.get(id) as User | undefined
  }

  async getCachedByHome(home: string) {
    let user = this.userHomeMap.get(home.toLowerCase())
    if (user) {
      return user as User
    }
    user = await this.udb.findUserByHome(home)
    if (user) this.cache(user)
    return user as User | undefined
  }

  getCachedByHomeStrict(home: string) {
    return this.userHomeMap.get(home.toLowerCase()) as User | undefined
  }

  async getCachedByEmailForce(email: string) {
    const user = await this.udb.findUserByEmail(email)
    if (user) {
      this.cache(user)
    }
    return user
  }

  cache(user: User) {
    this.userIdMap.set(user.id, user)
    this.userHomeMap.set(user.home.toLowerCase(), user)
  }

}
