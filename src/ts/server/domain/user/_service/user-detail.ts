import { ErrorConst } from '@common/type/error'
import { USER_NOT_FOUND } from '@common/type/error-const'
import { newUserDetail } from '@common/type/user-detail'
import { userCanUpdateUser } from '@server/domain/user/_service/user-auth'
import { User } from '@common/type/user'
import { UserDB } from '@server/db/user/user-db'
import { dateNull } from '@common/type/date-const'

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
