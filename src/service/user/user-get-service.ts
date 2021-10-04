import { UserCache } from '../../db/user/cache/user-cache.js'
import { dateNull } from '../../_util/date2.js'
import { newUserView } from '../../_type/user-view.js'
import { userCanUpdateUser } from '../../web/api/user-login/login-api.js'
import { ErrorConst } from '../../_type/error.js'
import { User } from '../../_type/user.js'
import { USER_NOT_FOUND } from '../../_type/error-user.js'

export async function userGetService(uc: UserCache, user: User, id: number, err: ErrorConst[]) {
  const user2 = await uc.getCachedById(id)
  if (!user2) {
    err.push(USER_NOT_FOUND)
    return
  }
  const view = newUserView(user2)
  if (!userCanUpdateUser(user, id)) {
    view.adate = dateNull
  }
  return view
}
