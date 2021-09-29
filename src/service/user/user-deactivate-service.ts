import { Error2 } from '../../_util/error2.js'
import { UserDB } from '../../db/user/user-db.js'
import { USER_NOT_FOUND } from '../../_type/error-user.js'

export async function userDeactivateService(udb: UserDB, id: number, err: Error2[]) {
  const count = await udb.updateUserStatus(id, 'd')
  if (!count) {
    err.push(USER_NOT_FOUND)
    return
  }
  udb.deleteCacheById(id)
}
