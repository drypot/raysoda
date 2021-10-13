import { dateNull } from '../../_util/date2'
import { newUserDetail } from '../../_type/user-detail'
import { ErrorConst } from '../../_type/error'
import { User } from '../../_type/user'
import { userCanUpdateUser } from '../user-auth/user-auth-service'
import { USER_NOT_FOUND } from '../../_type/error-const'
import { UserDB } from '../../db/user/user-db'

export async function userDetailService(udb: UserDB, user: User, id: number, err: ErrorConst[]) {
  const user2 = await udb.getCachedById(id)
  if (!user2) {
    err.push(USER_NOT_FOUND)
    return
  }
  const detail = newUserDetail(user2)
  if (!userCanUpdateUser(user, id)) {
    detail.adate = dateNull
  }
  return detail
}
