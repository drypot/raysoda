import { USER_NOT_FOUND } from '../../../common/type/error-const.ts'
import { UserDB } from '../../../db/user/user-db.ts'
import type { User } from '../../../common/type/user.ts'
import type { ErrorConst } from '../../../common/type/error.ts'
import { newUserDetail } from '../../../common/type/user-detail.ts'
import { userCanUpdateUser } from './user-auth.ts'
import { dateNull } from '../../../common/type/date-const.ts'

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
