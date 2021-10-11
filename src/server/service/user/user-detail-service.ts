import { UserCache } from '../../db/user/cache/user-cache'
import { dateNull } from '../../_util/date2'
import { newUserDetail } from '../../_type/user-detail'
import { ErrorConst } from '../../_type/error'
import { User } from '../../_type/user'
import { USER_NOT_FOUND } from '../../_type/error-user'
import { userCanUpdateUser } from '../user-auth/user-auth-service'

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
