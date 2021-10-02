import { UserCache } from '../../db/user/cache/user-cache.js'
import { dateNull } from '../../_util/date2.js'
import { newUserView } from '../../_type/user-view.js'

export async function userDetailService(uc: UserCache, uid: number, includePrivate: boolean) {
  const user = await uc.getCachedById(uid)
  if (user) {
    const user2 = newUserView(user)
    if (includePrivate) {
      return user2
    }
    user2.email = ''
    user2.adate = dateNull
    return user2
  }
  return undefined
}
