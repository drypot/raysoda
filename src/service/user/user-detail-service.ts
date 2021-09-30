import { userDetailOf } from '../../_type/user.js'
import { UserCache } from '../../db/user/user-cache.js'
import { dateNull } from '../../_util/date2.js'

export async function userDetailService(uc: UserCache, uid: number, includePrivate: boolean) {
  const user = await uc.getCachedById(uid)
  if (!user) {
    return undefined
  }
  const user2 = userDetailOf(user)
  if (!includePrivate) {
    user2.email = ''
    user2.adate = dateNull
  }
  return user2
}
