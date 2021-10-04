import { UserCache } from '../../db/user/cache/user-cache.js'
import { dateNull } from '../../_util/date2.js'
import { newUserDetail } from '../../_type/user-detail.js'
import { userCanUpdateUser } from '../../web/api/user-login/login-api.js'
import { ErrorConst } from '../../_type/error.js'
import { User } from '../../_type/user.js'
import { USER_NOT_FOUND } from '../../_type/error-user.js'

export async function userDetailService(uc: UserCache, user: User, id: number, err: ErrorConst[]) {
  const target = await uc.getCachedById(id)
  if (!target) {
    err.push(USER_NOT_FOUND)
    return
  }
  const detail = newUserDetail(target)
  if (!userCanUpdateUser(user, id)) {
    detail.adate = dateNull
  }
  return detail
}
