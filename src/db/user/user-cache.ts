import { User } from '../../common/type/user.js'

// 20219-09-29, user cache 시스템을 날리려다 원복했다.
// user cache 는 MongoDB 에 join 없음 문제로 부터 시작된 것 같다.
// express session 이 object 를 저장하지 못하는 문제도 한몫했다.
// 현재는 req.session 에 uid 만 저장한다.
// 매 Request 가 도착할 때마다 res.locals.user 에 cached user 를 연결한다.
// 없애기 힘들 것 같다.

export class UserCache {

  private idMap = new Map
  private homeMap = new Map

  constructor() {
  }

  resetCache() {
    this.idMap = new Map
    this.homeMap = new Map
  }

  cacheUser(user: User) {
    this.idMap.set(user.id, user)
    this.homeMap.set(user.home.toLowerCase(), user)
  }

  deleteCacheById(id: number) {
    const user = this.idMap.get(id)
    if (user) {
      this.idMap.delete(id)
      this.homeMap.delete(user.home.toLowerCase())
    }
  }

  getCachedById(id: number): User | undefined {
    return this.idMap.get(id)
  }

  getCachedByHome(home: string): User | undefined {
    return this.homeMap.get(home.toLowerCase())
  }

}
