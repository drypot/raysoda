import { USER_NOT_FOUND } from '../../_type/error-user.js'
import { UserCache } from '../../db/user/user-cache.js'
import { ErrorConst } from '../../_type/error.js'

export async function userDeactivateService(uc: UserCache, id: number, err: ErrorConst[]) {
  const count = await uc.udb.updateUserStatus(id, 'd')
  if (!count) {
    err.push(USER_NOT_FOUND)
    return
  }
  uc.deleteCacheById(id)
}
