import { USER_NOT_FOUND } from '../../../common/type/error-const.js'
import { UserDB } from '../../../db/user/user-db.js'
import { User } from '../../../common/type/user.js'
import { ErrorConst } from '../../../common/type/error.js'
import { newUserDetail } from '../../../common/type/user-detail.js'
import { userCanUpdateUser } from './user-auth.js'
import { dateNull } from '../../../common/type/date-const.js'

export async function getUserDetail(udb: UserDB, user: User, id: number, err: ErrorConst[]) {
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
